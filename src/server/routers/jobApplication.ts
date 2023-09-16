import { protectedProcedure, router } from "../trpc";

import { TRPCError } from "@trpc/server";
import { checkUserIsHealthEntityMember } from "../services/permissionsService";
import { getJobOffer } from "../database/jobOfferRepository";
import { setJobApplicationStatus } from "../database/jobApplicationRepository";
import { z } from "zod";

export const jobApplicationRouter = router({
  setStatus: protectedProcedure
    .input(
      z.object({
        jobOfferId: z.string(),
        userId: z.string(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const jobOffer = await getJobOffer(input.jobOfferId);
      if (!jobOffer) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await checkUserIsHealthEntityMember(jobOffer.healthEntityId);

      await setJobApplicationStatus({
        jobOfferId: input.jobOfferId,
        status: input.status,
        userId: input.userId,
      });

      return input;
    }),
});
