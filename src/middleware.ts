import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { pathToRegexp } from "path-to-regexp";

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

const isPublicRoute = createRouteMatcher((req) => {
  const path = new URL(req.url).pathname;
  return (
    !privateOverrides.some((x) => x.test(path)) &&
    publicRoutes.some((x) => x.test(path))
  );
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/job-offer/search",
  "/job-offer/:id",
  "/api/(.*)",
  "/api/trpc/jobOffer.get",
  "/health-entity/:id",
].map((x) => pathToRegexp(x));

const privateOverrides = [
  "/health-entity/manage",
  "/job-offer/list",
  "/job-offer/create",
  "/health-entity/members",
  "/health-entity/edit",
  "/job-offer/applications",
].map((x) => pathToRegexp(x));
