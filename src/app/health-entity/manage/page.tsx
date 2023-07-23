import { Card, CardHeader } from "@/components/ui/card";
import { FilePlus, Pencil, Users2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getHealthEntity } from "@/api/healthEntity";

export default async function ManageHealthEntity() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;
  const healthEntity = await getHealthEntity(healthEntityId);

  return (
    <div className="container py-4">
      <div className="mb-6 flex items-center gap-4 flex-col md:flex-row">
        {healthEntity.logoUrl && (
          <Image
            src={healthEntity.logoUrl}
            className="rounded"
            alt=""
            width="80"
            height="80"
          />
        )}
        <h1 className="text-2xl">{healthEntity.name}</h1>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/job-offer/create">
          <Card>
            <CardHeader className="flex flex-row gap-4">
              <FilePlus />
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
