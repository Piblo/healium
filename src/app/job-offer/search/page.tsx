"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { trpc } from "@/utils/trpc";

dayjs.locale(es);
dayjs.extend(relativeTime);

type SearchJobOfferProps = {
  searchParams: {
    search?: string;
    region?: string;
  };
};

export default function SearchJobOffer({ searchParams }: SearchJobOfferProps) {
  const { data } = trpc.jobOffer.search.useQuery({
    region: searchParams.region,
    search: searchParams.search,
  });

  return (
    <div className="container py-4">
      <h1>Ofertas de trabajo</h1>
      <ul className="space-y-4">
        {data?.map((x) => (
          <li key={x.id}>
            <Card className="p-4 flex space-x-4">
              {x.healthEntity?.logoUrl && (
                <Image
                  src={x.healthEntity?.logoUrl}
                  alt=""
                  width="80"
                  height="80"
                  className="rounded self-start"
                />
              )}
              <div>
                <div className="text-xl">{x.title}</div>
                <div className="mb-2">{x.healthEntity!.name}</div>
                <div className="mb-4 text-sm">
                  {x.region} | {dayjs(x.createdDate).fromNow()}
                </div>
                <div>{x.description}</div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
