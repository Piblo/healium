import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  image: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type HealiumFileRouter = typeof fileRouter;
