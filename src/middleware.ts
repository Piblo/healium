import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/job-offer/search",
    "/job-offer/:id",
    "/api/trpc/jobOffer.search",
    "/api/trpc/jobOffer.get",
    "/api/uploadthing",
    "/_vercel/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
