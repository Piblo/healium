import { Briefcase, CalendarClock, MapPin, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContractType, getContractTypeLabel } from "@/utils/contractType";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { JobOfferDropdownMenu } from "./JobOfferDropdownMenu";
import Link from "next/link";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import { trpc } from "@/trpc/server";

export default async function JobOfferList() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;

  const jobOffers = await trpc.jobOffer.healthEntityJobOffers.query({
    healthEntityId: healthEntityId,
  });

  return (
    <div className="container py-6 max-w-screen-lg">
      <BackButton className="mb-4" href="/health-entity/manage" />
      <h1 className="text-2xl font-bold mb-4">Ofertas publicadas</h1>
      <ul className="space-y-4">
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
              hoursPerWeek={x.jobOffer.hoursPerWeek ?? undefined}
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
  hoursPerWeek?: number;
};
const JobOfferWithApplicationSummary = ({
  id,
  title,
  city,
  region,
  contractType,
  applicationCount,
  publishedDate,
  hoursPerWeek,
}: JobOfferWithApplicationSummaryProps) => {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1">
        <div className="text-lg">{title}</div>
        <JobOfferDropdownMenu jobOfferId={id} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Publicada el {dayjs(publishedDate).format("DD/MM/YYYY")}
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-x-32">
          <ul className="dark:text-neutral-300 text-sm grid sm:grid-cols-3 grid-cols-1 gap-2 md:flex-row md:gap-8 flex-[2]">
            <li className="flex items-center">
              <MapPin size={16} className="mr-1" /> {city} ({region})
            </li>
            <li className="flex items-center">
              <Briefcase size={16} className="mr-1" />{" "}
              {getContractTypeLabel(contractType)}
            </li>
            {hoursPerWeek ? (
              <li className="flex items-center">
                <CalendarClock size={16} className="mr-1" /> {hoursPerWeek}{" "}
                horas semanales
              </li>
            ) : null}
          </ul>
          <dl className="text-sm flex-1">
            <dt className="text-muted-foreground">Solicitudes</dt>
            <dd className="text-green-500">{applicationCount}</dd>
          </dl>
        </div>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/job-offer/${id}/applications`}>Ver solicitudes</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/job-offer/${id}/rota`}>Ver rota</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
