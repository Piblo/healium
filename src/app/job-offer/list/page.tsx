import { cookies } from "next/headers";
import { getJobOffers } from "@/api/jobOffers";

export default async function ListJobOffers() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;
  const jobOffers = await getJobOffers(healthEntityId);

  return (
    <div>
      <h1>Ofertas</h1>
      {JSON.stringify(jobOffers)}
    </div>
  );
}
