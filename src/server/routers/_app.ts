import {
  NewHealthEntity,
  healthEntities,
  healthEntityUsers,
} from "../database/schema";
import { protectedProcedure, router } from "../trpc";

import { clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
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
        await ctx.db.transaction(async (tx) => {
          const healthEntity: NewHealthEntity = {
            id: ulid(),
            name: input.name,
          };

          await tx.insert(healthEntities).values(healthEntity);

          await tx.insert(healthEntityUsers).values({
            healthEntityId: healthEntity.id,
            userId: ctx.auth.userId,
            createdDate: new Date(),
          });
        });
      }),
    get: protectedProcedure
      .input(
        z.object({
          healthEntityId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const result = await ctx.db
          .select()
          .from(healthEntities)
          .where(eq(healthEntities.id, input.healthEntityId));

        if (!result.length) {
          return null;
        }

        return result[0];
      }),
    members: protectedProcedure
      .input(
        z.object({
          healthEntityId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const members = await ctx.db
          .select({
            userId: healthEntityUsers.userId,
          })
          .from(healthEntityUsers)
          .innerJoin(
            healthEntities,
            eq(healthEntities.id, healthEntityUsers.healthEntityId)
          )
          .where(eq(healthEntities.id, input.healthEntityId));

        const users = await clerkClient.users.getUserList({
          userId: members.map((x) => x.userId),
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
        })
      )
      .mutation(async ({ input }) => {
        await clerkClient.invitations.createInvitation({
          emailAddress: input.emailAddress,
          // redirectUrl: ''
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
