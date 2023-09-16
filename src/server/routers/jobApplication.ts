import { protectedProcedure, router } from "../trpc";

import { ApplicationAcceptedEmail } from "@/components/ApplicationAcceptedEmail";
import { Resend } from "resend";
import { TRPCError } from "@trpc/server";
import { checkUserIsHealthEntityMember } from "../services/permissionsService";
import { clerkClient } from "@clerk/nextjs";
import { getJobOffer } from "../database/jobOfferRepository";
import { getPrimaryEmailAddress } from "../utils/user";
import { setJobApplicationStatus } from "../database/jobApplicationRepository";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

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

      if (input.status === "approved") {
        const user = await clerkClient.users.getUser(input.userId);

        await resend.sendEmail({
          from: "onboarding@resend.dev",
          to: getPrimaryEmailAddress(user)?.emailAddress!,
          subject: "Tu solicitud ha sido aceptada!",
          react: ApplicationAcceptedEmail(),
        });
      }

      return input;
    }),
});
