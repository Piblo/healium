import {
  createHealthEntity,
  getHealthEntity,
  getHealthEntityMembers,
} from "../database/healthEntityRepository";
import { healthEntities, healthEntityUsers } from "../database/schema";
import { protectedProcedure, router } from "../trpc";

import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  healthEntity: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await clerkClient.users.getUser(ctx.auth.userId);

        return await createHealthEntity({
          healthEntity: {
            name: input.name,
          },
          user: {
            email: user.emailAddresses.find(
              (x) => x.id === user.primaryEmailAddressId
            )?.emailAddress!,
            id: ctx.auth.userId,
          },
        });
      }),
    get: protectedProcedure
      .input(
        z.object({
          healthEntityId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getHealthEntity(input.healthEntityId);
      }),
    members: protectedProcedure
      .input(
        z.object({
          healthEntityId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const members = await getHealthEntityMembers(input.healthEntityId);

        const users = await clerkClient.users.getUserList({
          emailAddress: members.map((x) => x.email),
        });

        return users.map((user) => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses[0].emailAddress,
        }));
      }),
    inviteMember: protectedProcedure
      .input(
        z.object({
          emailAddress: z.string(),
          healthEntityId: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const data = await clerkClient.invitations.createInvitation({
          emailAddress: input.emailAddress,
          redirectUrl: `${getBaseUrl()}/health-entity/${
            input.healthEntityId
          }/join`,
          publicMetadata: {
            healthEntityId: input.healthEntityId,
          },
        });

        await ctx.db.insert(healthEntityUsers).values({
          email: input.emailAddress,
          healthEntityId: input.healthEntityId,
          invitedDate: new Date(),
          status: "pending",
        });
      }),
  }),
  user: router({
    healthEntities: protectedProcedure.query(async ({ ctx }) => {
      const h = await ctx.db
        .select({
          id: healthEntities.id,
          name: healthEntities.name,
        })
        .from(healthEntities)
        .innerJoin(
          healthEntityUsers,
          eq(healthEntities.id, healthEntityUsers.healthEntityId)
        )
        .where(eq(healthEntityUsers.userId, ctx.auth.userId));

      return h;
    }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

export function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
