import { NextRequest, NextResponse } from "next/server";

import { addYears } from "date-fns";
import { revalidatePath } from "next/cache";

export function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const url = request.nextUrl.clone();
  url.pathname = "/health-entity/manage";
  const response = NextResponse.redirect(url);

  response.cookies.set("healthEntityId", params.id, {
    expires: addYears(new Date(), 1),
  });

  revalidatePath("/health-entity/manage");

  return response;
}
