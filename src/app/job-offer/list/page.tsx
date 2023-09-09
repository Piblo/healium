import { Briefcase, MapPin } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { ContractType } from "@/components/JobOfferForm";
import { JobOfferDropdownMenu } from "./JobOfferDropdownMenu";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import { getContractTypeLabel } from "@/utils/contractType";
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
      <ul className="space-y-4 divide-y">
        {jobOffers.map((x) => (
          <li key={x.jobOffer.id}>
            <JobOfferWithApplicationSummary
              id={x.jobOffer.id}
              title={x.jobOffer.title}
              city={x.jobOffer.city ?? ""}
              region={x.jobOffer.region ?? ""}
              contractType={x.jobOffer.contractType ?? "fixed-term"}
              applicationCount={x.applicationsCount}
              publishedDate={x.jobOffer.createdDate}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

type JobOfferWithApplicationSummaryProps = {
  id: string;
  title: string;
  city: string;
  region: string;
  contractType: ContractType;
  applicationCount?: number;
  publishedDate: Date;
};
const JobOfferWithApplicationSummary = ({
  id,
  title,
  city,
  region,
  contractType,
  applicationCount,
  publishedDate,
}: JobOfferWithApplicationSummaryProps) => {
  return (
    <div className="py-2 flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <div className="text-lg">{title}</div>
        <JobOfferDropdownMenu jobOfferId={id} />
      </div>
      <div className="text-sm text-muted-foreground">
        Publicada el {dayjs(publishedDate).format("DD/MM/YYYY")}
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-32">
        <ul className="dark:text-neutral-300 text-sm flex gap-8 flex-[2]">
          <li className="flex items-center flex-1">
            <MapPin size={16} className="mr-1" /> {city} ({region})
          </li>
          <li className="flex items-center flex-1">
            <Briefcase size={16} className="mr-1" />{" "}
            {getContractTypeLabel(contractType)}
          </li>
        </ul>
        <dl className="text-sm flex-1">
          <dt className="text-muted-foreground">Solicitudes</dt>
          <dd className="text-green-500">{applicationCount}</dd>
        </dl>
      </div>
    </div>
  );
};
