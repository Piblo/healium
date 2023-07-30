import { and, eq } from "drizzle-orm";
import {
  createHealthEntity,
  getHealthEntity,
  getHealthEntityMembers,
  removeMember,
  updateHealthEntity,
} from "../database/healthEntityRepository";
import { isHealiumAdmin, procedure, protectedProcedure, router } from "../trpc";

import { checkUserIsHealthEntityMember } from "../services/permissionsService";
import { clerkClient } from "@clerk/nextjs";
import { getBaseUrl } from "./_app";
import { getPrimaryEmailAddress } from "../utils/user";
import { healthEntityUsers } from "../database/schema";
import { z } from "zod";

const createHealthEntityInput = z.object({
  name: z.string(),
  logoUrl: z.string().nullable().default(null),
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

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
        },
        user: {
          email: user.emailAddresses.find(
            (x) => x.id === user.primaryEmailAddressId
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
      })
    )
    .query(async ({ ctx, input }) => {
      return getHealthEntity(input.healthEntityId);
    }),
  members: protectedProcedure
    .input(
      z.object({
        healthEntityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);
      const members = await getHealthEntityMembers(input.healthEntityId);

      const users = await clerkClient.users.getUserList({
        emailAddress: members.map((x) => x.email),
      });

      return members.map((member) => {
        const user = users.find((x) =>
          x.emailAddresses.map((x) => x.emailAddress).includes(member.email)
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
        emailAddress: z.string(),
        healthEntityId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);

      await clerkClient.invitations.createInvitation({
        emailAddress: input.emailAddress,
        redirectUrl: `${getBaseUrl()}/health-entity/${
          input.healthEntityId
        }/join`,
      });

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
      })
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
            eq(healthEntityUsers.email, emailAddress?.emailAddress!)
          )
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
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);
      await removeMember(input);
    }),
});
