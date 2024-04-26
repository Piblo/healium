import { ArrowRight } from "lucide-react";
import { JobOfferSummary } from "@/components/JobOfferSummary";
import { Link } from "@/components/Link";
import { UserApplicationsOutput } from "@/trpc/client";
import { trpc } from "@/trpc/server";

export default async function Applications() {
  // TODO implement pagination
  const jobApplications = await trpc.user.applications.query();

  const current = jobApplications.filter(
    (x) =>
      x.startDate &&
      x.startDate <= new Date() &&
      x.endDate &&
      x.endDate >= new Date() &&
      x.status === "approved"
  );

  const approvedUpcoming = jobApplications.filter(
    (x) =>
      x.status === "approved" &&
      x.startDate &&
      x.startDate > new Date() &&
      !current.includes(x)
  );

  const approvedPast = jobApplications.filter(
    (x) => x.status === "approved" && (!x.endDate || x.endDate < new Date())
  );
  const pending = jobApplications.filter((x) => x.status === "pending");
  const rejected = jobApplications.filter((x) => x.status === "rejected");

  return (
    <section className="container max-w-screen-lg py-6">
      <h1 className="text-2xl font-semibold mb-6">Mis solicitudes de empleo</h1>
      {jobApplications.length === 0 && (
        <div>
          <p className="text-muted-foreground">
            No has solicitado ningún puesto de trabajo
          </p>
          <Link href="/job-offer/search" className="flex gap-2 mt-2">
            Buscar ofertas de trabajo
          </Link>
        </div>
      )}
      {current.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">En activo</h2>
          <ul className="space-y-4">
            {current.map((x) => (
              <li key={x.jobOfferId}>
                <Application {...x} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {approvedUpcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Aprobadas</h2>
          <ul className="space-y-4">
            {approvedUpcoming.map((x) => (
              <li key={x.jobOfferId}>
                <Application {...x} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Pendientes</h2>
          <ul className="space-y-4">
            {pending.map((x) => (
              <li key={x.jobOfferId}>
                <Application {...x} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {rejected.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Rechazadas</h2>
          <ul className="space-y-4">
            {rejected.map((x) => (
              <li key={x.jobOfferId}>
                <Application {...x} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {approvedPast.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Historial de trabajos</h2>
          <ul className="space-y-4">
            {approvedPast.map((x) => (
              <li key={x.jobOfferId}>
                <Application {...x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

const Application = (application: UserApplicationsOutput) => (
  <JobOfferSummary
    id={application.jobOfferId}
    city={application.jobOffer.city ?? ""}
    contractType={application.jobOffer.contractType ?? "full-time"}
    createdDate={application.jobOffer.createdDate}
    description={application.jobOffer.description ?? ""}
    healthEntityName={application.jobOffer.healthEntity.name}
    healthEntityId={application.jobOffer.healthEntityId}
    region={application.jobOffer.region ?? ""}
    title={application.jobOffer.title}
    logo={application.jobOffer.healthEntity.logoUrl}
    applicationStatus={application.status}
    startDate={application.jobOffer.startDate}
    endDate={application.jobOffer.endDate}
    hoursPerWeek={application.jobOffer.hoursPerWeek}
    applicationEndDate={application.endDate}
    applicationStartDate={application.startDate}
    salaryPerHour={
      application.jobOffer.salaryPerHour
        ? Number(application.jobOffer.salaryPerHour)
        : null
    }
  />
);
