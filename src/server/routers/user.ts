import { healthEntities, healthEntityUsers } from "../database/schema";
import { protectedProcedure, router } from "../trpc";

import { eq } from "drizzle-orm";
import { getJobApplicationsForUser } from "../database/jobApplicationRepository";

export const userRouter = router({
  healthEntities: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: healthEntities.id,
        name: healthEntities.name,
        logoUrl: healthEntities.logoUrl,
      })
      .from(healthEntities)
      .innerJoin(
        healthEntityUsers,
        eq(healthEntities.id, healthEntityUsers.healthEntityId)
      )
      .where(eq(healthEntityUsers.userId, ctx.auth.userId));
  }),
  applications: protectedProcedure.query(async ({ ctx }) => {
    return await getJobApplicationsForUser(ctx.auth.userId);
  }),
});
