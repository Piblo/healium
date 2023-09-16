import { JobOfferSummary } from "@/components/JobOfferSummary";
import { trpc } from "@/trpc/server";

export default async function Applications() {
  const jobApplications = await trpc.user.applications.query();

  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-xl mb-4">Mis solicitudes de empleo</h1>
      {jobApplications.map((x) => (
        <JobOfferSummary
          key={x.jobOfferId}
          city={x.jobOffer.city ?? ""}
          contractType={x.jobOffer.contractType ?? "full-time"}
          createdDate={x.jobOffer.createdDate}
          description={x.jobOffer.description ?? ""}
          healthEntityName={x.jobOffer.healthEntity.name}
          region={x.jobOffer.region ?? ""}
          title={x.jobOffer.title}
          logo={x.jobOffer.healthEntity.logoUrl}
          applicationStatus={x.status}
        />
      ))}
    </div>
  );
}
