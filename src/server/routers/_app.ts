import { healthEntityRouter } from "./healthEntity";
import { jobOfferRouter } from "./jobOffer";
import { router } from "../trpc";
import { userRouter } from "./user";

export const appRouter = router({
  healthEntity: healthEntityRouter,
  user: userRouter,
  jobOffer: jobOfferRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
