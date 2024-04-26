import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ApplyButton } from "./ApplyButton";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { JobOfferSummary } from "@/components/JobOfferSummary";
import Link from "next/link";
import { addDays } from "date-fns";
import { dateFormatter } from "@/utils/date";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

export default async function Apply({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string; to?: string };
}) {
  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  if (!jobOffer) {
    notFound();
  }

  const from = searchParams.from ? new Date(searchParams.from) : new Date();
  const to = searchParams.to
    ? new Date(searchParams.to)
    : addDays(new Date(), 7);

  return (
    <section className="container py-6 max-w-screen-md space-y-6">
      <h1 className="text-2xl font-semibold">Confirmar solicitud de empleo</h1>
      <JobOfferSummary
        id={jobOffer.id}
        city={jobOffer.city ?? ""}
        contractType={jobOffer.contractType ?? "full-time"}
        createdDate={jobOffer.createdDate}
        description={jobOffer.description ?? ""}
        healthEntityName={jobOffer.healthEntity.name}
        healthEntityId={jobOffer.healthEntityId}
        region={jobOffer.region ?? ""}
        title={jobOffer.title}
        logo={jobOffer.healthEntity.logoUrl}
        endDate={jobOffer.endDate}
        hoursPerWeek={jobOffer.hoursPerWeek}
        salaryPerHour={jobOffer.salaryPerHour}
        startDate={jobOffer.startDate}
      />
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle className="mb-4 font-semibold">
          Deseas solicitar este puesto de trabajo?
        </AlertTitle>
        <AlertDescription className="text-muted-foreground">
          <p>
            ¿Estás seguro de que deseas solicitar este puesto de trabajo? Una
            vez que envíes tu solicitud, el centro de salud recibirá tu perfil y
            se considerará como una postulación oficial.
          </p>
          {jobOffer.contractType !== "full-time" && (
            <dl className="mt-4">
              <dt className="text-foreground font-semibold">
                Duración del empleo
              </dt>
              <dd>{dateFormatter.formatRange(from, to)}</dd>
            </dl>
          )}
        </AlertDescription>
      </Alert>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button variant="secondary" asChild>
          <Link href={`/job-offer/${params.id}`}>
            Volver a la oferta de trabajo
          </Link>
        </Button>
        <ApplyButton jobOfferId={params.id} />
      </div>
    </section>
  );
}
