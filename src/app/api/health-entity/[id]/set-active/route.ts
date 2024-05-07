import { NextRequest, NextResponse } from "next/server";

import { revalidatePath } from "next/cache";

export function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = NextResponse.redirect(
    `${process.env.VERCEL_URL ?? "http://localhost:3000"}/health-entity/manage`
  );
  response.cookies.set("healthEntityId", params.id);

  revalidatePath("/health-entity/manage");

  return response;
}
