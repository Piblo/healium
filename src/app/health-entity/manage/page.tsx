import { Card, CardHeader } from "@/components/ui/card";
import { FilePlus, Users2 } from "lucide-react";

import Link from "next/link";
import { cookies } from "next/headers";

export default async function ManageHealthEntity() {
  const healthEntityId = cookies().get("healthEntityId")?.value;
  const response = await fetch(
    `http://localhost:3000/api/health-entity/${healthEntityId}`,
    {
      credentials: "include",
    }
  );

  const healthEntity = await response.json();

  return (
    <div className="container py-4">
      <h1 className="text-2xl mb-4">{healthEntity.name}</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Link href="members">
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
      </div>
    </div>
  );
}
