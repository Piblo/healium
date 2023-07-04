import { procedure, router } from "../trpc";

import { z } from "zod";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return { greeting: `hello ${opts.input.text}` };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
