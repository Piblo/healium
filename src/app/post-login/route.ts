import { NextRequest } from "next/server";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const caller = appRouter.createCaller(createContext({ req } as any));

  const result = await caller.user.healthEntities();

  if (result.length === 1) {
    return redirect(`/health-entity/${result[0].id}/manage`);
  }

  if (result.length > 1) {
    return redirect("/health-entity/choose");
  }

  redirect("/");
}
