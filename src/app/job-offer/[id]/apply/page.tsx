import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ApplyButton } from "./ApplyButton";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { JobOfferSummary } from "@/components/JobOfferSummary";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

export default async function Apply({ params }: { params: { id: string } }) {
  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  if (!jobOffer) {
    notFound();
  }

  return (
    <div className="container py-6 max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Confirmar solicitud de empleo</h1>
      <JobOfferSummary
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
        <AlertTitle className="mb-4">
          Deseas solicitar este puesto de trabajo?
        </AlertTitle>
        <AlertDescription>
          ¿Estás seguro de que deseas solicitar este puesto de trabajo? Una vez
          que envíes tu solicitud, el centro de salud recibirá tu perfil y se
          considerará como una postulación oficial.
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
    </div>
  );
}
