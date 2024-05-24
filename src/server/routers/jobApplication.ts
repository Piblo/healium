import {
  getJobApplication,
  setJobApplicationStatus,
} from "../database/jobApplicationRepository";
import { protectedProcedure, router } from "../trpc";

import ApplicationAcceptedEmail from "@/emails/ApplicationAcceptedEmail";
import { TRPCError } from "@trpc/server";
import { checkUserIsHealthEntityMember } from "../services/permissionsService";
import { clerkClient } from "@clerk/nextjs/server";
import { getJobOffer } from "../database/jobOfferRepository";
import { getPrimaryEmailAddress } from "../utils/user";
import { resendClient } from "../clients/resend";
import { z } from "zod";

export const jobApplicationRouter = router({
  setStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().ulid(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const jobApplication = await getJobApplication(input.id);
      if (!jobApplication?.jobOffer.healthEntityId) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await checkUserIsHealthEntityMember(
        jobApplication?.jobOffer.healthEntityId
      );

      await setJobApplicationStatus({
        id: input.id,
        status: input.status,
      });

      if (input.status === "approved") {
        const user = await clerkClient.users.getUser(jobApplication.userId);
        const jobOffer = await getJobOffer(jobApplication.jobOfferId);

        if (!jobOffer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Job offer not found",
          });
        }

        await resendClient.emails.send({
          from: "onboarding@resend.dev",
          to: getPrimaryEmailAddress(user)?.emailAddress!,
          subject: "Tu solicitud ha sido aceptada!",
          react: ApplicationAcceptedEmail({
            jobOffer,
            healthEntity: jobOffer.healthEntity,
          }),
        });
      }

      return input;
    }),
});
