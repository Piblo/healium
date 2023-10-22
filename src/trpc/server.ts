import {
  createTRPCProxyClient,
  unstable_httpBatchStreamLink,
} from "@trpc/client";

import { AppRouter } from "@/server/routers/_app";
import SuperJSON from "superjson";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { headers } from "next/headers";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    unstable_httpBatchStreamLink({
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
