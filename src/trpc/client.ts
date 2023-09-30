import type { AppRouter } from "../server/routers/_app";
import { createTRPCReact } from "@trpc/react-query";
import { inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();

type RouterOutput = inferRouterOutputs<AppRouter>;

export type CandidateProfileOutput = RouterOutput["candidate"]["profile"];
export type JobOfferApplicationsOutput =
  RouterOutput["jobOffer"]["applications"];
