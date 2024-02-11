import { AppRouter, appRouter } from "@/server/routers/_app";
import {
  TRPCClientError,
  createTRPCProxyClient,
  loggerLink,
} from "@trpc/client";

import SuperJSON from "superjson";
import { TRPCErrorResponse } from "@trpc/server/rpc";
import { callProcedure } from "@trpc/server";
import { createContext } from "@/server/trpc";
import { observable } from "@trpc/server/observable";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    () =>
      ({ op }) =>
        observable((observer) => {
          const ctx = createContext();

          callProcedure({
            procedures: appRouter._def.procedures,
            path: op.path,
            rawInput: op.input,
            ctx,
            type: op.type,
          })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
  transformer: SuperJSON,
});
