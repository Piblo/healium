import { healthEntities, healthEntityUsers } from "../database/schema";
import { protectedProcedure, router } from "../trpc";

import { eq } from "drizzle-orm";

export const userRouter = router({
  healthEntities: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
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
  }),
});
