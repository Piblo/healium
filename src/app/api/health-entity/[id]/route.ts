import { NextResponse } from "next/server";
import { getHealthEntity } from "@/server/database/healthEntityRepository";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const healthEntity = await getHealthEntity(params.id);
  return NextResponse.json(healthEntity);
}
