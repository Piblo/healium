import { NextRequest } from "next/server";
import { appRouter } from "@/server/routers/_app";
import { cookies } from "next/headers";
import { createContext } from "@/server/trpc";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const caller = appRouter.createCaller(createContext({ req } as any));

  const result = await caller.user.healthEntities();

  cookies().delete("healthEntityId");

  if (result.length === 1) {
    cookies().set("healthEntityId", result[0].id);
    return redirect(`/health-entity/manage`);
  }

  if (result.length > 1) {
    return redirect("/health-entity/choose");
  }

  redirect("/");
}
