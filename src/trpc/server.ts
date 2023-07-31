import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { AppRouter } from "@/server/routers/_app";
import SuperJSON from "superjson";
import { auth } from "@clerk/nextjs";
import { getBaseUrl } from "@/utils/getBaseUrl";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // You can pass any HTTP headers you wish here
      async headers() {
        const { getToken } = auth();
        const token = await getToken();

        return {
          authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
  transformer: SuperJSON,
});
