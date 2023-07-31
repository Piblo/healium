import { BackButton } from "@/components/BackButton";
import { DeleteButton } from "./DeleteButton";
import { JobOfferSummary } from "@/components/JobOfferSummary";
import { cookies } from "next/headers";
import { trpc } from "@/trpc/server";

export default async function ListJobOffers() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;

  const jobOffers = await trpc.jobOffer.healthEntityJobOffers.query({
    healthEntityId: healthEntityId,
  });

  return (
    <div className="container py-4">
      <BackButton className="mb-2" href="/health-entity/manage" />
      <h1 className="text-xl mb-6">Ofertas publicadas</h1>
      <ul className="space-y-4">
        {jobOffers.map((x) => (
          <li key={x.id}>
            <a href={`/job-offer/${x.id}`}>
              <JobOfferSummary
                city={x.city ?? ""}
                contractType={x.contractType ?? "full-time"}
                createdDate={x.createdDate}
                description={x.description ?? ""}
                healthEntityName={x.healthEntity.name}
                region={x.region ?? ""}
                title={x.title}
                logo={x.healthEntity.logoUrl}
              >
                <div className="flex justify-end">
                  <DeleteButton jobOfferId={x.id} />
                </div>
              </JobOfferSummary>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
