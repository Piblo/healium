import { Clock, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getContractTypeLabel } from "@/utils/contractType";
import { notFound } from "next/navigation";
import { trpcServer } from "@/utils/trpcServer";

export default async function JobOffer({ params }: { params: { id: string } }) {
  const jobOffer = await trpcServer.jobOffer.get.query({
    jobOfferId: params.id,
  });

  if (!jobOffer) {
    notFound();
  }

  return (
    <div className="container py-4 space-y-4">
      <h1 className="text-2xl mb-6">{jobOffer.title}</h1>
      <p>{jobOffer.healthEntity.name}</p>
      <ul>
        <li className="flex items-center">
          <MapPin size={16} className="mr-1" /> {jobOffer.city} (
          {jobOffer.region})
        </li>
        <li className="flex items-center">
          <Clock size={16} className="mr-1" />
          <span>{getContractTypeLabel(jobOffer.contractType!)}</span>
          {jobOffer.contractType === "fixed-term" && (
            <span>
              {" "}
              desde {jobOffer.startDate?.toLocaleDateString()} a{" "}
              {jobOffer.endDate?.toLocaleDateString()}
            </span>
          )}
        </li>
      </ul>
      <p>{jobOffer.description}</p>
      <Button>Solicitar puesto</Button>
    </div>
  );
}
