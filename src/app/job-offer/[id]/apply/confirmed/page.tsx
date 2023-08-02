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
    <div className="container py-8 space-y-4">
      <h1 className="text-xl">Solicitud de Empleo Enviada</h1>
      <p className="text-lg">¡Felicidades {user?.firstName}!</p>
      <p>Has enviado tu solicitud para el puesto de trabajo:</p>
      <JobOfferSummary
        city={jobOffer.city ?? ""}
        contractType={jobOffer.contractType ?? "full-time"}
        createdDate={jobOffer.createdDate}
        description={jobOffer.description ?? ""}
        healthEntityName={jobOffer.healthEntity.name}
        region={jobOffer.region ?? ""}
        title={jobOffer.title}
        logo={jobOffer.healthEntity.logoUrl}
      />
      <p>
        El centro de salud ha sido notificado de tu interés y pronto se pondrán
        en contacto contigo si tu perfil coincide con sus requerimientos. ¡Buena
        suerte!
      </p>
      <Button asChild>
        <Link href="/job-offer/search">Volver a ofertas de trabajo</Link>
      </Button>
    </div>
  );
}
