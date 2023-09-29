import { upsertCandidateProfile } from "@/server/database/candidateProfileRepository";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  image: f({ image: { maxFileSize: "4MB" } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("file url", file.url);
    }),
  pdf: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file, metadata }) => {
      console.log(file);
      await upsertCandidateProfile({
        userId: metadata.userId,
        curriculumVitaeUrl: file.url,
        curriculumVitaeName: file.name,
      });
    }),
} satisfies FileRouter;

export type HealiumFileRouter = typeof fileRouter;

async function authMiddleware() {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  return { userId: user.id };
}
