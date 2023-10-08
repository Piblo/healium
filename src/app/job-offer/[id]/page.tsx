import { Mail, MapPin, Phone } from "lucide-react";

import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/components/Link";
import NextLink from "next/link";
import { currentUser } from "@clerk/nextjs";
import { getContractTypeLabel } from "@/utils/contractType";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

export default async function JobOffer({ params }: { params: { id: string } }) {
  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  const user = await currentUser();

  const userApplications = user
    ? await trpc.jobOffer.applications.query({
        jobOfferId: params.id,
      })
    : [];

  const hasUserApplied = Boolean(
    userApplications.find((x) => x.userId === user?.id)
  );

  if (!jobOffer) {
    notFound();
  }

  return (
    <div className="container py-6 max-w-4xl">
      {jobOffer.healthEntity.logoUrl && (
        <Image
          src={jobOffer.healthEntity.logoUrl}
          alt=""
          width={80}
          height={80}
          className="rounded mx-auto md:mx-0 mb-4"
        />
      )}
      <h1 className="text-2xl mb-2">{jobOffer.title}</h1>
      <p className="text-lg mb-4 text-muted-foreground">
        {jobOffer.healthEntity.name}
      </p>
      <ul className="text-sm space-y-2 mb-4">
        <li className="flex items-center">
          <MapPin size={16} className="mr-2" /> {jobOffer.city} (
          {jobOffer.region})
        </li>
        <li className="flex items-center">
          <Briefcase size={16} className="mr-2" />
          <span>
            {getContractTypeLabel(jobOffer.contractType!)}{" "}
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
      <p className="mb-6">{jobOffer.description}</p>
      {hasUserApplied ? (
        <>
          <p className="text-muted-foreground mb-2 text-sm">
            Ya has solicitado este trabajo
          </p>
          <Button variant="outline" asChild>
            <NextLink href="/job-offer/applications">
              Ver mis solicitudes
            </NextLink>
          </Button>
        </>
      ) : (
        <Button disabled asChild>
          <NextLink href={`/job-offer/${params.id}/apply`}>
            Solicitar puesto
          </NextLink>
        </Button>
      )}
    </div>
  );
}
