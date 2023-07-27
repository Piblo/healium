import {
  createJobOffer,
  deleteJobOffer,
  getJobOffers,
  searchJobOffers,
} from "../database/jobOfferRepository";
import { procedure, protectedProcedure, router } from "../trpc";

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

export const jobOfferRouter = router({
  create: protectedProcedure.input(createInput).mutation(async ({ input }) => {
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
    .query(({ input }) => {
      return searchJobOffers(input);
    }),
  healthEntityJobOffers: protectedProcedure
    .input(z.object({ healthEntityId: z.string() }))
    .query(({ input }) => {
      return getJobOffers(input.healthEntityId);
    }),
  delete: protectedProcedure
    .input(
      z.object({
        jobOfferId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteJobOffer(input.jobOfferId);
    }),
});
