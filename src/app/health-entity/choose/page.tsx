"use client";

import { Card, CardHeader } from "@/components/ui/card";

import { trpc } from "@/utils/trpc";

export default function ChooseHealthEntity() {
  const { data } = trpc.user.healthEntities.useQuery();

  return (
    <div className="container">
      <h1 className="text-4xl">Elige una entidad sanitaria</h1>
      <ul>
        {data?.map((x) => (
          <li key={x.id}>
            <button>
              <Card>
                <CardHeader>{x.name}</CardHeader>
              </Card>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
