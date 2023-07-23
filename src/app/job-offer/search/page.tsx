"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { trpc } from "@/utils/trpc";

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
    <div className="container">
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
                  className="rounded"
                />
              )}
              <div>
                <div className="text-xl">{x.title}</div>
                <div>{x.healthEntity!.name}</div>
                <div>{x.region}</div>
                <div>{x.description}</div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
