import { procedure, router } from "../trpc";

import { createHealthEntity } from "../database/healthEntityRepository";
import { ulid } from "ulid";
import { z } from "zod";

export const appRouter = router({
  healthEntity: router({
    create: procedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .mutation(async (opts) => {
        await createHealthEntity({
          id: ulid(),
          name: opts.input.name,
        });
      }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
