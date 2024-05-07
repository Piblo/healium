"use server";

import { CreateHealthEntityRequest } from "@/server/routers/healthEntity";
import { createHealthEntity as create } from "../../../server/database/healthEntityRepository";
import { currentUser } from "@clerk/nextjs/server";

export async function createHealthEntity(request: CreateHealthEntityRequest) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const healthEntity = await create({
    healthEntity: request,
    user: {
      email: user.primaryEmailAddress?.emailAddress!,
      id: user.id,
    },
  });

  return healthEntity;
}
