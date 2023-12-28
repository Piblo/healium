import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { File, FileCheck, Inbox } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import { trpc } from "@/trpc/server";

export async function Stats() {
  const healthEntityId = cookies().get("healthEntityId")?.value!;
  const stats = await trpc.healthEntity.stats.query({
    healthEntityId,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
          <span className="text-2xl font-bold">{stats.jobOfferCount ?? 0}</span>
        </CardContent>
      </Card>
    </div>
  );
}

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Skeleton className="h-[116px]" />
      <Skeleton className="h-[116px]" />
      <Skeleton className="h-[116px]" />
    </div>
  );
};
