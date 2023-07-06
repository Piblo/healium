import {
  NewHealthEntity,
  healthEntities,
  healthEntityUsers,
} from "../database/schema";
import { protectedProcedure, router } from "../trpc";

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
          });
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
