import { Button } from "@/components/ui/button";
import { JobOfferSummary } from "@/components/JobOfferSummary";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

type ApplicationConfirmedProps = {
  params: { id: string };
};

export default async function ApplicationConfirmed({
  params,
}: ApplicationConfirmedProps) {
  const user = await currentUser();
  const jobOffer = await trpc.jobOffer.get.query({ jobOfferId: params.id });

  if (!jobOffer) {
    notFound();
  }

  return (
    <div className="container max-w-screen-md py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Solicitud de empleo enviada</h1>
      <p className="text-lg">¡Felicidades {user?.firstName}!</p>
      <p>Has enviado tu solicitud para el puesto de trabajo:</p>
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
      <p>
        El centro de salud ha sido notificado de tu interés y pronto se pondrán
        en contacto contigo si tu perfil coincide con sus requerimientos. ¡Buena
        suerte!
      </p>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <Button asChild variant="secondary">
          <Link href="/job-offer/applications">Ver mis solicitudes</Link>
        </Button>
        <Button asChild>
          <Link href="/job-offer/search">Volver a ofertas de trabajo</Link>
        </Button>
      </div>
    </div>
  );
}
