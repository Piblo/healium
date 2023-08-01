import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/components/Link";
import NextLink from "next/link";
import { getContractTypeLabel } from "@/utils/contractType";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

export default async function JobOffer({ params }: { params: { id: string } }) {
  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  if (!jobOffer) {
    notFound();
  }

  return (
    <div className="container py-4 space-y-4 max-w-4xl">
      {jobOffer.healthEntity.logoUrl && (
        <Image
          src={jobOffer.healthEntity.logoUrl}
          alt=""
          width={80}
          height={80}
          className="rounded mx-auto md:mx-0"
        />
      )}
      <h1 className="text-2xl">{jobOffer.title}</h1>
      <p className="text-lg">{jobOffer.healthEntity.name}</p>
      <ul className="text-sm space-y-2">
        <li className="flex items-center">
          <MapPin size={16} className="mr-2" /> {jobOffer.city} (
          {jobOffer.region})
        </li>
        <li className="flex items-center">
          <Clock size={16} className="mr-2" />
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
      <p>{jobOffer.description}</p>
      <Button asChild>
        <NextLink href={`/job-offer/${params.id}/apply`}>
          Solicitar puesto
        </NextLink>
      </Button>
    </div>
  );
}
