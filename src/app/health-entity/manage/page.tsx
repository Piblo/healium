"use client";

import { Card, CardHeader } from "@/components/ui/card";

import Link from "next/link";
import { Users2 } from "lucide-react";
import { getCookie } from "cookies-next";
import { trpc } from "@/utils/trpc";

type Props = {
  params: {
    id: string;
  };
};

export default function ManageHealthEntity() {
  const { data } = trpc.healthEntity.get.useQuery({
    healthEntityId: getCookie("healthEntityId") as string,
  });

  return (
    <div className="container py-4">
      <h1 className="text-2xl mb-4">{data?.name}</h1>
      <Link href="members">
        <Card>
          <CardHeader className="flex flex-row gap-4">
            <Users2 />
            Miembros
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
