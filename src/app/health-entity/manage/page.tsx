import { Card, CardHeader } from "@/components/ui/card";
import { FilePlus2, FileSearch, Pencil, Users2 } from "lucide-react";
import { Stats, StatsSkeleton } from "./Stats";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { trpc } from "@/trpc/server";

export default async function ManageHealthEntity() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;
  const healthEntity = await trpc.healthEntity.get.query({
    healthEntityId,
  });

  if (!healthEntity) {
    redirect("/health-entity/choose");
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4 flex-col md:flex-row">
        {healthEntity.logoUrl && (
          <Image
            priority
            src={healthEntity.logoUrl}
            className="rounded border object-cover aspect-square"
            alt=""
            width="80"
            height="80"
          />
        )}
        <h1 className="text-2xl">{healthEntity.name}</h1>
      </div>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Link className="" href="/job-offer/list">
          <Card>
            <CardHeader className="flex flex-row gap-4">
              <FileSearch />
              Ver ofertas publicadas
            </CardHeader>
          </Card>
        </Link>
        <Link href="/job-offer/create">
          <Card>
            <CardHeader className="flex flex-row gap-4">
              <FilePlus2 />
              Crear oferta
            </CardHeader>
          </Card>
        </Link>
        <Link href="members">
          <Card>
            <CardHeader className="flex flex-row gap-4">
              <Users2 />
              Miembros
            </CardHeader>
          </Card>
        </Link>
        <Link href="edit">
          <Card>
            <CardHeader className="flex flex-row gap-4">
              <Pencil />
              Editar entidad sanitaria
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
