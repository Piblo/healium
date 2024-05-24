import { healthEntities, healthEntityUsers } from "../database/schema";
import { protectedProcedure, router } from "../trpc";

import { eq } from "drizzle-orm";
import { getJobApplicationsForUser } from "../database/jobApplicationRepository";
import { z } from "zod";

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
      .where(eq(healthEntityUsers.userId, ctx.auth.userId))
      .limit(10);
  }),
  applications: protectedProcedure
    .input(
      z
        .object({
          jobOfferId: z.string(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return await getJobApplicationsForUser(
        ctx.auth.userId,
        input?.jobOfferId
      );
    }),
});
