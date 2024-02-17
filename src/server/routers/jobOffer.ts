import {
  createJobApplication,
  getJobApplicationsForJobOffer,
} from "../database/jobApplicationRepository";
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
import { clerkClient } from "@clerk/nextjs";
import { selectJobApplicationSchema } from "../database/schema";
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
  hoursPerWeek: z.number().positive().optional(),
  salaryPerHour: z.number().nullish(),
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
    .query(async ({ input }) => {
      const jobOffer = await getJobOffer(input.jobOfferId);

      if (!jobOffer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job offer not found",
        });
      }

      return {
        ...jobOffer,
        salaryPerHour: jobOffer.salaryPerHour
          ? Number(jobOffer.salaryPerHour)
          : undefined,
      };
    }),
  create: protectedProcedure.input(createInput).mutation(async ({ input }) => {
    await checkUserIsHealthEntityMember(input.healthEntityId);

    await createJobOffer({
      ...input,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      salaryPerHour: input.salaryPerHour?.toString() ?? null,
    });
  }),
  search: procedure
    .input(
      z.object({
        search: z.string().optional(),
        region: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.string().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
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
    .mutation(async ({ input }) => {
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
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await createJobApplication({
        jobOfferId: input.jobOfferId,
        userId: ctx.auth.userId,
        status: "pending",
        endDate: input.endDate,
        startDate: input.startDate,
      });
    }),
  update: protectedProcedure.input(updateInput).mutation(async ({ input }) => {
    await checkUserIsHealthEntityMember(input.healthEntityId);
    await updateJobOffer({
      ...input,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      hoursPerWeek: input.hoursPerWeek ?? null,
      salaryPerHour: input.salaryPerHour?.toString() ?? null,
    });
  }),
  applications: protectedProcedure
    .input(
      z.object({
        jobOfferId: z.string(),
        status: selectJobApplicationSchema.shape.status.optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const jobOffer = await getJobOffer(input.jobOfferId);

      if (!jobOffer) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await checkUserIsHealthEntityMember(jobOffer.healthEntityId);

      const applications = await getJobApplicationsForJobOffer(
        input.jobOfferId,
        {
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
        }
      );
      const users = await clerkClient.users.getUserList({
        userId: applications.map((x) => x.userId),
      });

      return applications.map((application) => {
        const user = users.find((x) => x.id === application.userId);

        return {
          ...application,
          user,
        };
      });
    }),
});
