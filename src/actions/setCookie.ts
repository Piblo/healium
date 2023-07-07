"use server";

import { cookies } from "next/headers";

export async function setCookie(healthEntityId: string) {
  cookies().set("healium.healthEntity", healthEntityId);
}
