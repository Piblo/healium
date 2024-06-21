import { Badge, badgeVariants } from "@/components/ui/badge";
import { Mail, MapPin, Phone } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/components/Link";
import NextLink from "next/link";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import { formatDateRange } from "@/utils/date";
import { getContractTypeLabel } from "@/utils/contractType";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

export type JobOfferProps = {
  params: { id: string };
  searchParams: Record<string, string>;
};

export default async function JobOffer({
  params,
  searchParams,
}: JobOfferProps) {
  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  if (!jobOffer) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-6">
      <SearchOfferForm className="mb-8 hidden md:flex" />
      <BackButton className="mb-4" />
      {jobOffer.healthEntity.logoUrl && (
        <Image
          src={jobOffer.healthEntity.logoUrl}
          alt=""
          width={80}
          height={80}
          className="rounded mx-auto md:mx-0 mb-4 aspect-square object-cover"
        />
      )}
      <h1 className="text-2xl font-semibold">{jobOffer.title}</h1>
      <Link
        className="text-lg mb-4 text-muted-foreground inline-block hover:underline"
        href={`/health-entity/${jobOffer.healthEntityId}`}
      >
        {jobOffer.healthEntity.name}
      </Link>
      <ul className="flex flex-wrap gap-2 text-sm mb-6">
        <li>
          <Badge variant="secondary" className="py-1">
            <MapPin size={16} className="mr-2" /> {jobOffer.city} (
            {jobOffer.region})
          </Badge>
        </li>
        <li>
          <Badge variant="secondary" className="py-1">
            <Briefcase size={16} className="mr-2" />
            <span>
              {getContractTypeLabel(jobOffer.contractType ?? "full-time")}{" "}
              {jobOffer.startDate && jobOffer.endDate && (
                <span>
                  {formatDateRange(jobOffer.startDate, jobOffer.endDate)}
                </span>
              )}
            </span>
          </Badge>
        </li>
        <li>
          <Link
            className={`text-foreground ${badgeVariants({
              variant: "secondary",
              className: "py-1 flex",
            })}`}
            href={`tel:${jobOffer.healthEntity.phoneNumber}`}
          >
            <Phone size={16} className="mr-2" />{" "}
            {jobOffer.healthEntity.phoneNumber}
          </Link>
        </li>
        <li>
          <Link
            className={`text-foreground ${badgeVariants({
              variant: "secondary",
              className: "py-1 flex",
            })}`}
            href={`mailto:${jobOffer.healthEntity.email}`}
          >
            <Mail size={16} className="mr-2" /> {jobOffer.healthEntity.email}
          </Link>
        </li>
      </ul>
      <h2 className="text-lg font-bold">Descripción</h2>
      <p className="text-base mb-6 text-muted-foreground">
        {jobOffer.description}
      </p>
      {jobOffer.healthEntity.description && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Sobre la entidad sanitaria</h2>
          <p className="text-muted-foreground mb-2">
            {jobOffer.healthEntity.description}
          </p>
          <Link
            href={`/health-entity/${jobOffer.healthEntityId}`}
            className="inline-block text-sm"
          >
            Ver más detalles
          </Link>
        </div>
      )}

      <Button disabled asChild>
        <NextLink
          href={`/job-offer/${params.id}/apply?${new URLSearchParams(
            searchParams
          ).toString()}`}
        >
          Solicitar puesto
        </NextLink>
      </Button>
    </div>
  );
}
