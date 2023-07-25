import { auth, currentUser } from "@clerk/nextjs";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { AppRouter } from "@/server/routers/_app";
import SuperJSON from "superjson";
import { getBaseUrl } from "./getBaseUrl";

export const trpcServer = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // You can pass any HTTP headers you wish here
      async headers() {
        const { getToken } = auth();
        const token = await getToken();
        console.log(token);
        return {
          authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
  transformer: SuperJSON,
});
