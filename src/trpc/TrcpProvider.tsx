"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getFetch,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";

import SuperJSON from "superjson";
import { getBaseUrl } from "../utils/getBaseUrl";
import { trpc } from "./client";

export const TrpcProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: () => true,
        }),
        unstable_httpBatchStreamLink({
          url: `${getBaseUrl()}/api/trpc`,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
