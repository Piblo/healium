import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  File,
  FileCheck,
  FilePlus2,
  FileSearch,
  Inbox,
  Pencil,
  Users2,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function ManageHealthEntity() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;
  const healthEntity = await trpc.healthEntity.get.query({
    healthEntityId,
  });

  const stats = await trpc.healthEntity.stats.query({
    healthEntityId,
  });

  if (!healthEntity) {
    redirect("/health-entity/choose");
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4 flex-col md:flex-row">
        <Suspense fallback={<Skeleton className="w-[300px] h-[25px]" />}>
          {healthEntity.logoUrl && (
            <Image
              priority
              src={healthEntity.logoUrl}
              className="rounded"
              alt=""
              width="80"
              height="80"
            />
          )}
          <h1 className="text-2xl">{healthEntity.name}</h1>
        </Suspense>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between text-sm">
            <span>Solicitudes</span>
            <Inbox className="mt-0 h-5 w-5 stroke-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {stats.jobApplicationCount ?? 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between text-sm">
            <span>Solicitudes aceptadas</span>
            <FileCheck className="mt-0 h-5 w-5 stroke-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {stats.acceptedJobApplicationCount ?? 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between text-sm">
            <span>Ofertas publicadas</span>
            <File className="mt-0 h-5 w-5 stroke-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {stats.jobOfferCount ?? 0}
            </span>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/job-offer/list">
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
