import {
  createCandidateProfile,
  getCandidateProfile,
} from "../database/candidateProfileRepository";
import { protectedProcedure, router } from "../trpc";

import { z } from "zod";

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
});
