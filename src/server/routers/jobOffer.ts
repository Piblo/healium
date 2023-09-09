import {
  createJobOffer,
  deleteJobOffer,
  getJobOffer,
  getJobOffers,
  searchJobOffers,
  updateJobOffer,
} from "../database/jobOfferRepository";
import { procedure, protectedProcedure, router } from "../trpc";

import { TRPCError } from "@trpc/server";
import { checkUserIsHealthEntityMember } from "../services/permissionsService";
import { createJobApplication } from "../database/jobApplicationRepository";
import { z } from "zod";

const createInput = z.object({
  title: z.string(),
  description: z.string(),
  region: z.string(),
  city: z.string(),
  contractType: z.enum(["full-time", "part-time", "fixed-term"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  healthEntityId: z.string(),
});

const updateInput = createInput.extend({
  id: z.string(),
});

export const jobOfferRouter = router({
  get: procedure
    .input(
      z.object({
        jobOfferId: z.string(),
      })
    )
    .query(({ input }) => {
      return getJobOffer(input.jobOfferId);
    }),
  create: protectedProcedure.input(createInput).mutation(async ({ input }) => {
    await checkUserIsHealthEntityMember(input.healthEntityId);

    await createJobOffer({
      ...input,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
    });
  }),
  search: procedure
    .input(
      z.object({
        search: z.string().optional(),
        region: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return searchJobOffers({
        ...input,
        userId: ctx.auth.userId,
      });
    }),
  healthEntityJobOffers: protectedProcedure
    .input(z.object({ healthEntityId: z.string() }))
    .query(async ({ input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);
      return getJobOffers(input.healthEntityId);
    }),
  delete: protectedProcedure
    .input(
      z.object({
        jobOfferId: z.string(),
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

      await deleteJobOffer(input.jobOfferId);
    }),
  apply: protectedProcedure
    .input(
      z.object({
        jobOfferId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await createJobApplication({
        jobOfferId: input.jobOfferId,
        userId: ctx.auth.userId,
      });
    }),
  update: protectedProcedure
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      await checkUserIsHealthEntityMember(input.healthEntityId);
      await updateJobOffer({
        ...input,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
      });
    }),
});
