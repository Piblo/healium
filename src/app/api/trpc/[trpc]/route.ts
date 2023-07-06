import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// https://github.com/wpcodevo/nextjs13-trpc-setup/blob/main/src/app/api/trpc/%5Btrpc%5D/route.ts

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: (opts) => {
      return createContext(opts as any);
    },
  });
};

export { handler as GET, handler as POST };
