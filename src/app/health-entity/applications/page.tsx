import { cookies } from "next/headers";
import { trpc } from "@/trpc/server";

export default async function Applications() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;

  const applications = await trpc.healthEntity.jobApplications.query({
    healthEntityId,
  });

  return <div className="container">{JSON.stringify(applications)}</div>;
}
