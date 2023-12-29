import {
  createCandidateProfile,
  getCandidateProfile,
  updateCandidateProfile,
} from "../database/candidateProfileRepository";
import { protectedProcedure, router } from "../trpc";

import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const utapi = new UTApi();

export const candidateRouter = router({
  profile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCandidateProfile(ctx.auth.userId);

    if (!profile) {
      return null;
    }

    return {
      isCvUploaded: Boolean(profile.curriculumVitaeUrl),
      cvFileName: profile.curriculumVitaeName,
      cvUrl: profile.curriculumVitaeUrl,
    };
  }),
  createProfile: protectedProcedure
    .input(
      z.object({
        curriculumVitaeUrl: z.string().url(),
      })
    )
    .mutation(({ ctx, input }) => {
      createCandidateProfile({
        userId: ctx.auth.userId,
        curriculumVitaeUrl: input.curriculumVitaeUrl,
      });
    }),

  deleteCv: protectedProcedure.mutation(async ({ ctx }) => {
    const existingProfile = await getCandidateProfile(ctx.auth.userId);

    if (!existingProfile) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    if (!existingProfile.curriculumVitaeUrl) {
      return;
    }

    const fileKey = existingProfile.curriculumVitaeUrl.replace(
      "https://utfs.io/f/",
      ""
    );

    await utapi.deleteFiles(fileKey);

    await updateCandidateProfile({
      ...existingProfile,
      curriculumVitaeUrl: null,
      curriculumVitaeName: null,
    });
  }),
});
