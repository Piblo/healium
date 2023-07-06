"use server";

import { cookies } from "next/headers";

export async function setCookie() {
  cookies().set("test", "test");
}
