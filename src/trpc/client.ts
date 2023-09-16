import type { AppRouter } from "../server/routers/_app";
import { createTRPCReact } from "@trpc/react-query";
import { defaultContext } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>({
  reactQueryContext: defaultContext, //https://github.com/TanStack/query/discussions/4619
});
