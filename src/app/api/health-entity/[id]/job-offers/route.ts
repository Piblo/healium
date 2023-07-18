import { NextRequest, NextResponse } from "next/server";

import { getJobOffers } from "@/server/database/jobOfferRepository";

type Params = {
  params: {
    id: string;
  };
};
export async function GET(request: NextRequest, { params }: Params) {
  const jobOffers = await getJobOffers(params.id);
  return NextResponse.json(jobOffers);
}
