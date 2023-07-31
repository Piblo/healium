"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Image from "next/image";
import { setSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function ChooseHealthEntity() {
  const { data } = trpc.user.healthEntities.useQuery();
  const router = useRouter();

  return (
    <div className="container py-6">
      <h1 className="text-xl mb-4">Elige una entidad sanitaria</h1>
      <ul className="space-y-2">
        {data?.map((x) => (
          <li key={x.id}>
            <button
              onClick={() => {
                setSelectedHealthEntityId(x.id);
                router.push("/health-entity/manage");
              }}
            >
              <Card className="p-4 flex text-lg">
                {x.logoUrl && (
                  <Image
                    className="mr-4"
                    width={80}
                    height={80}
                    src={x.logoUrl}
                    alt=""
                  />
                )}
                {x.name}
              </Card>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
