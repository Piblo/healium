import { JobOfferSummary } from "@/components/JobOfferSummary";
import { trpc } from "@/trpc/server";

export default async function Applications() {
  const jobApplications = await trpc.user.applications.query();

  return (
    <div className="container max-w-screen-lg py-6">
      <h1 className="text-2xl font-semibold mb-6">Mis solicitudes de empleo</h1>
      <ul className="space-y-4">
        {jobApplications.map((x) => (
          <li key={x.jobOfferId}>
            <JobOfferSummary
              id={x.jobOfferId}
              city={x.jobOffer.city ?? ""}
              contractType={x.jobOffer.contractType ?? "full-time"}
              createdDate={x.jobOffer.createdDate}
              description={x.jobOffer.description ?? ""}
              healthEntityName={x.jobOffer.healthEntity.name}
              healthEntityId={x.jobOffer.healthEntityId}
              region={x.jobOffer.region ?? ""}
              title={x.jobOffer.title}
              logo={x.jobOffer.healthEntity.logoUrl}
              applicationStatus={x.status}
              startDate={x.jobOffer.startDate}
              endDate={x.jobOffer.endDate}
              hoursPerWeek={x.jobOffer.hoursPerWeek}
              applicationEndDate={x.endDate}
              applicationStartDate={x.startDate}
              showHealthEntityLink
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
