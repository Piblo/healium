import {
  CandidateProfile,
  CandidateProfileInsert,
  candidateProfiles,
} from "./schema";

import { db } from "./connection";
import { eq } from "drizzle-orm";

export async function getCandidateProfile(
  userId: string
): Promise<CandidateProfile | undefined> {
  return db.query.candidateProfiles.findFirst({
    where: eq(candidateProfiles.userId, userId),
  });
}

export async function createCandidateProfile(
  profile: CandidateProfileInsert
): Promise<void> {
  await db.insert(candidateProfiles).values(profile);
}

export async function updateCandidateProfile(profile: CandidateProfile) {
  await db
    .update(candidateProfiles)
    .set(profile)
    .where(eq(candidateProfiles.userId, profile.userId));
}

export async function upsertCandidateProfile(profile: CandidateProfileInsert) {
  const existingProfile = await getCandidateProfile(profile.userId);

  if (existingProfile) {
    await updateCandidateProfile({
      curriculumVitaeName: profile.curriculumVitaeName ?? null,
      curriculumVitaeUrl: profile.curriculumVitaeUrl ?? null,
      userId: profile.userId,
    });

    return;
  }

  await createCandidateProfile(profile);
}
