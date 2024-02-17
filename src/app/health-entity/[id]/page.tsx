import { Mail, Phone } from "lucide-react";

import Image from "next/image";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";

type HealthEntityProps = {
  params: {
    id: string;
  };
};

export default async function HealthEntity({ params }: HealthEntityProps) {
  const healthEntity = await trpc.healthEntity.get.query({
    healthEntityId: params.id,
  });

  if (!healthEntity) {
    notFound();
  }

  const paragraphs = healthEntity?.description?.split("\n") ?? [];

  return (
    <div className="container py-6 max-w-screen-lg">
      {healthEntity?.logoUrl && (
        <Image
          src={healthEntity?.logoUrl}
          height={100}
          width={100}
          alt=""
          className="rounded mb-4"
        />
      )}
      <h1 className="text-4xl mb-6">{healthEntity?.name}</h1>
      <div className="mb-6 flex gap-6">
        {healthEntity.email && (
          <a
            href={`mailto:${healthEntity.email}`}
            className={cn(
              `flex gap-1 items-center`,
              badgeVariants({ variant: "secondary" })
            )}
          >
            <Mail className="h-4" /> {healthEntity.email}
          </a>
        )}
        {healthEntity.phoneNumber && (
          <a
            href={`tel:${healthEntity.phoneNumber}`}
            className={cn(
              `flex gap-1 items-center`,
              badgeVariants({ variant: "secondary" })
            )}
          >
            <Phone className="h-4" /> {healthEntity.phoneNumber}
          </a>
        )}
      </div>
      <div className="mb-6">
        {paragraphs.map((p, i) => (
          <p key={i} className="mb-4 dark:text-gray-400">
            {p}
          </p>
        ))}
      </div>
      <h2 className="text-xl mb-2">Dirección</h2>
      <p className="dark:text-gray-400">{healthEntity.address}</p>
    </div>
  );
}
