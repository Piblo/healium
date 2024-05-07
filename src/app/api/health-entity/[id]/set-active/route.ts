import { NextRequest, NextResponse } from "next/server";

import { revalidatePath } from "next/cache";

export function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = request.nextUrl.clone();
  url.pathname = "/health-entity/manage";
  const response = NextResponse.redirect(url);

  response.cookies.set("healthEntityId", params.id);

  revalidatePath("/health-entity/manage");

  return response;
}
