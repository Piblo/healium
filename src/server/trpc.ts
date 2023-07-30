import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { getAuth } from "@clerk/nextjs/server";
import superjson from "superjson";
import { db } from "./database/connection";
import { clerkClient } from "@clerk/nextjs";

export const createContext = (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req);
  return {
    auth,
    db,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const procedure = t.procedure;

const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const isHealiumAdmin = t.middleware(async ({ next, ctx }) => {
  const user = await clerkClient.users.getUser(ctx.auth.userId!);

  if (!user.publicMetadata.healiumAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not Healium Admin",
    });
  }

  return next();
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
