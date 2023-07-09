"use client";

import { Card, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function ChooseHealthEntity() {
  const { data } = trpc.user.healthEntities.useQuery();
  const router = useRouter();

  return (
    <div className="container">
      <h1 className="text-4xl">Elige una entidad sanitaria</h1>
      <ul>
        {data?.map((x) => (
          <li key={x.id}>
            {/* <Link href={`/health-entity/${x.id}/manage`}> */}
            <button
              onClick={() => {
                setCookie("healthEntityId", x.id);
                router.push("/health-entity/manage");
              }}
            >
              <Card>
                <CardHeader>{x.name}</CardHeader>
              </Card>
            </button>
            {/* </Link> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
