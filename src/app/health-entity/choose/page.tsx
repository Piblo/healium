import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/trpc/server";

export default async function ChooseHealthEntity() {
  const healthEntities = await trpc.user.healthEntities.query();

  return (
    <div className="container py-6 max-w-lg">
      <h1 className="text-2xl font-semibold md:text-4xl mb-4">
        Elige una entidad sanitaria
      </h1>
      <ul className="space-y-2 flex flex-col gap-2">
        {healthEntities?.map((x) => (
          <li key={x.id}>
            <Link
              className="w-full"
              href={`/api/health-entity/${x.id}/set-active`}
            >
              <Card className="p-4 flex text-lg font-semibold">
                {x.logoUrl && (
                  <Image
                    className="mr-4 rounded border aspect-square object-cover"
                    width={80}
                    height={80}
                    src={x.logoUrl}
                    alt=""
                  />
                )}
                {x.name}
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
