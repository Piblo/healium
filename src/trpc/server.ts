import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";

import { AppRouter } from "@/server/routers/_app";
import SuperJSON from "superjson";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { headers } from "next/headers";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        const heads = new Map(headers());
        heads.set("x-trpc-source", "rsc");
        return Object.fromEntries(heads);
      },
    }),
  ],
  transformer: SuperJSON,
});
