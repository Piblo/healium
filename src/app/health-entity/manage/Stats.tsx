import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Contact, File, FileCheck, Inbox } from "lucide-react";

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
      <Card className="bg-slate-100 dark:bg-slate-900">
        <CardHeader className="pb-2 flex flex-row justify-between text-sm">
          <span className="text-muted-foreground">Solicitudes</span>
          <Inbox className="mt-0 h-5 w-5 stroke-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">
            {stats.jobApplicationCount ?? 0}
          </span>
        </CardContent>
      </Card>
      <Card className="bg-slate-100 dark:bg-slate-900">
        <CardHeader className="pb-2 flex flex-row justify-between text-sm">
          <span className="text-muted-foreground">Solicitudes aceptadas</span>
          <FileCheck className="mt-0 h-5 w-5 stroke-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">
            {stats.acceptedJobApplicationCount ?? 0}
          </span>
        </CardContent>
      </Card>
      <Card className="bg-slate-100 dark:bg-slate-900">
        <CardHeader className="pb-2 flex flex-row justify-between text-sm">
          <span className="text-muted-foreground">Ofertas publicadas</span>
          <File className="mt-0 h-5 w-5 stroke-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{stats.jobOfferCount ?? 0}</span>
        </CardContent>
      </Card>
      <Card className="bg-slate-100 dark:bg-slate-900">
        <CardHeader className="pb-2 flex flex-row justify-between text-sm">
          <span className="text-muted-foreground">Empleados en plantilla</span>
          <Contact className="mt-0 h-5 w-5 stroke-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{123}</span>
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
