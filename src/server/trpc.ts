import { TRPCError, initTRPC } from "@trpc/server";
import { auth, clerkClient } from "@clerk/nextjs";

import { ZodError } from "zod";
import { db } from "./database/neon/connection";
import superjson from "superjson";

export const createContext = () => {
  const user = auth();
  return {
    auth: user,
    db,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
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
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not authenticated",
    });
  }

  const user = await clerkClient.users.getUser(ctx.auth.userId);

  if (!user.publicMetadata.healiumAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not Healium Admin",
    });
  }

  return next();
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
