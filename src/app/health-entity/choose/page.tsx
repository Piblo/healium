"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { setSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

export default function ChooseHealthEntity() {
  const { data, isLoading } = trpc.user.healthEntities.useQuery();
  const router = useRouter();

  return (
    <div className="container py-6 max-w-lg">
      <h1 className="text-2xl md:text-4xl mb-4">Elige una entidad sanitaria</h1>
      {isLoading && <Loader2 className="animate-spin" />}
      <ul className="space-y-2 flex flex-col gap-2">
        {data?.map((x) => (
          <li key={x.id}>
            <button
              className="w-full"
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
