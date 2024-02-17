import { Mail, MapPin, Phone } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/components/Link";
import NextLink from "next/link";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import { auth } from "@clerk/nextjs";
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

  const user = await auth();

  const userApplications = user.userId
    ? await trpc.user.applications.query({
        jobOfferId: params.id,
      })
    : [];

  const hasUserApplied = Boolean(
    userApplications.find((x) => x.userId === user.userId)
  );

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
          className="rounded mx-auto md:mx-0 mb-4"
        />
      )}
      <h1 className="text-2xl font-semibold">{jobOffer.title}</h1>
      <Link
        className="text-lg mb-4 text-muted-foreground inline-block hover:underline"
        href={`/health-entity/${jobOffer.healthEntityId}`}
      >
        {jobOffer.healthEntity.name}
      </Link>
      <h2 className="text-lg font-bold">Descripción</h2>
      <p className="text-base mb-6 text-muted-foreground">
        {jobOffer.description}
      </p>
      <ul className="text-sm space-y-2 mb-6">
        <li className="flex items-center">
          <MapPin size={16} className="mr-2" /> {jobOffer.city} (
          {jobOffer.region})
        </li>
        <li className="flex items-center">
          <Briefcase size={16} className="mr-2" />
          <span>
            {getContractTypeLabel(jobOffer.contractType ?? "full-time")}{" "}
            {jobOffer.contractType === "fixed-term" && (
              <span>
                {" "}
                desde {jobOffer.startDate?.toLocaleDateString()} a{" "}
                {jobOffer.endDate?.toLocaleDateString()}
              </span>
            )}
          </span>
        </li>
        <li className="flex items-center">
          <Phone size={16} className="mr-2" />{" "}
          <Link href={`tel:${jobOffer.healthEntity.phoneNumber}`}>
            {jobOffer.healthEntity.phoneNumber}
          </Link>
        </li>
        <li className="flex items-center">
          <Mail size={16} className="mr-2" />{" "}
          <Link href={`mailto:${jobOffer.healthEntity.email}`}>
            {jobOffer.healthEntity.email}
          </Link>
        </li>
      </ul>
      {jobOffer.healthEntity.description && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Sobre la entidad sanitaria</h2>
          <p className="text-muted-foreground mb-2">
            {jobOffer.healthEntity.description}
          </p>
          <Link
            href={`/health-entity/${jobOffer.healthEntityId}`}
            className="inline-block"
          >
            Ver más detalles
          </Link>
        </div>
      )}
      {hasUserApplied ? (
        <>
          <p className="text-muted-foreground mb-2 text-sm">
            Ya has solicitado este puesto
          </p>
          <Button variant="outline" asChild>
            <NextLink href="/job-offer/applications">
              Ver mis solicitudes
            </NextLink>
          </Button>
        </>
      ) : (
        <Button disabled asChild>
          <NextLink
            href={`/job-offer/${params.id}/apply?${new URLSearchParams(
              searchParams
            ).toString()}`}
          >
            Solicitar puesto
          </NextLink>
        </Button>
      )}
    </div>
  );
}
