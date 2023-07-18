import { protectedProcedure, router } from "../trpc";

import { createJobOffer } from "../database/jobOfferRepository";
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
});
