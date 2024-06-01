import { and, eq } from "drizzle-orm";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import {
  createHealthEntity,
  getHealthEntity,
  getHealthEntityMembers,
  getHealthEntityStats,
  removeMember,
  updateHealthEntity,
} from "../database/healthEntityRepository";
import {
  healthEntityUsers,
  selectJobApplicationSchema,
} from "../database/schema";
import { isHealiumAdmin, procedure, protectedProcedure, router } from "../trpc";

import HealthEntityInviteEmailProps from "@/emails/HealthEntityInviteEmail";
import { TRPCError } from "@trpc/server";
import { checkUserIsHealthEntityMember } from "../services/permissionsService";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getJobApplicationsForHealthEntity } from "../database/jobApplicationRepository";
import { getPrimaryEmailAddress } from "../utils/user";
import { resendClient } from "../clients/resend";
import { z } from "zod";

const createHealthEntityInput = z.object({
  name: z.string(),
  logoUrl: z.string().nullable().default(null),
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  registrationNumber: z.string(),
  description: z.string().nullable(),
});

export type CreateHealthEntityRequest = z.infer<typeof createHealthEntityInput>;

const updateHealthEntityInput = createHealthEntityInput.extend({
  id: z.string(),
});

export const healthEntityRouter = router({
  create: protectedProcedure
    .use(isHealiumAdmin)
    .input(createHealthEntityInput)
    .mutation(async ({ ctx, input }) => {
      const user = await clerkClient.users.getUser(ctx.auth.userId);

      return createHealthEntity({
        healthEntity: {
          name: input.name,
          logoUrl: input.logoUrl,
          address: input.address,
          email: input.email,
          phoneNumber: input.phoneNumber,
          registrationNumber: input.registrationNumber,
          description: input.description,
        },
        user: {
          email: user.emailAddresses.find(
            (x) => x.id === user.primaryEmailAddressId,
          )?.emailAddress!,
          id: ctx.auth.userId,
        },
      });
    }),
  update: protectedProcedure
    .input(updateHealthEntityInput)
    .mutation(async ({ input }) => {
      await checkUserIsHealthEntityMember(input.id);
      return updateHealthEntity(input);
    }),
  get: procedure
    .input(
      z.object({
        healthEntityId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getHealthEntity(input.healthEntityId);
    }),
  members: protectedProcedure
    .input(
      z.object({
        healthEntityId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);
      const members = await getHealthEntityMembers(input.healthEntityId);

      const users = await clerkClient.users.getUserList({
        emailAddress: members.map((x) => x.email),
      });

      return members.map((member) => {
        const user = users.data.find((x) =>
          x.emailAddresses.map((x) => x.emailAddress).includes(member.email),
        );

        return {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: member.email,
          status: member.status,
          invitedDate: member.invitedDate,
          userId: member.userId,
        };
      });
    }),
  inviteMember: protectedProcedure
    .input(
      z.object({
        emailAddress: z.string().email(),
        healthEntityId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);

      const invitations = await clerkClient.invitations.getInvitationList({
        status: "pending",
      });

      const invitationExists = Boolean(
        invitations.data.find((x) => x.emailAddress === input.emailAddress),
      );

      if (!invitationExists) {
        await clerkClient.invitations.createInvitation({
          emailAddress: input.emailAddress,
          redirectUrl: `${getBaseUrl()}/health-entity/${
            input.healthEntityId
          }/join`,
        });
      } else {
        const healthEntity = await getHealthEntity(input.healthEntityId);
        if (!healthEntity) {
          throw new TRPCError({
            message: "Health entity not found",
            code: "NOT_FOUND",
          });
        }

        const inviter = await currentUser();
        if (!inviter) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
          });
        }

        await resendClient.emails.send({
          from: "onboarding@resend.dev",
          to: input.emailAddress,
          subject: "Bienvenido a Healium",
          react: HealthEntityInviteEmailProps({
            healthEntityName: healthEntity.name,
            healthEntityId: healthEntity.id,
            healthEntityLogo: healthEntity.logoUrl,
            inviter,
          }),
        });
      }

      await ctx.db.insert(healthEntityUsers).values({
        email: input.emailAddress,
        healthEntityId: input.healthEntityId,
        invitedDate: new Date(),
        status: "pending",
      });
    }),
  acceptInvitation: protectedProcedure
    .input(
      z.object({
        healthEntityId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await clerkClient.users.getUser(ctx.auth.userId);
      const emailAddress = getPrimaryEmailAddress(user);

      await ctx.db
        .update(healthEntityUsers)
        .set({
          status: "accepted",
          acceptedDate: new Date(),
          userId: ctx.auth.userId,
        })
        .where(
          and(
            eq(healthEntityUsers.healthEntityId, input.healthEntityId),
            eq(healthEntityUsers.email, emailAddress?.emailAddress!),
          ),
        );

      await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
          healthEntityAdmin: true,
        },
      });
    }),
  removeMember: protectedProcedure
    .input(
      z.object({
        healthEntityId: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);
      await removeMember(input);
    }),
  jobApplications: protectedProcedure
    .input(
      z.object({
        healthEntityId: z.string(),
        status: selectJobApplicationSchema.shape.status.optional(),
      }),
    )
    .query(async ({ input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);

      const applications = await getJobApplicationsForHealthEntity(
        input.healthEntityId,
      );
      const userIds = applications.map((x) => x.jobApplication.userId);

      const users = await clerkClient.users.getUserList({
        userId: userIds,
      });

      return applications.map((application) => {
        const user = users.data.find(
          (user) => user.id === application.jobApplication.userId,
        );

        return {
          user: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.emailAddresses.find(
              (x) => x.id === user.primaryEmailAddressId,
            )?.emailAddress,
            phoneNumber: user?.phoneNumbers.find(
              (x) => x.id === user.primaryPhoneNumberId,
            )?.phoneNumber,
          },
          application: application.jobApplication,
          jobOffer: application.jobOffer,
        };
      });
    }),
  stats: protectedProcedure
    .input(
      z.object({
        healthEntityId: z.string(),
      }),
    )
    .query(({ input }) => {
      return getHealthEntityStats(input.healthEntityId);
    }),
});
