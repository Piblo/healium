import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/routers/_app";

// https://github.com/wpcodevo/nextjs13-trpc-setup/blob/main/src/app/api/trpc/%5Btrpc%5D/route.ts

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function (
      opts: FetchCreateContextFnOptions
    ): object | Promise<object> {
      return {};
    },
  });
};

export { handler as GET, handler as POST };
