"use client";

import { Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { getContractTypeLabel } from "@/utils/contractType";
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
  const { data, isLoading, isFetched } = trpc.jobOffer.search.useQuery({
    region: searchParams.region,
    search: searchParams.search,
  });

  return (
    <div className="container max-w-4xl py-6">
      <SearchOfferForm className="mb-6" />
      <h1 className="text-2xl mb-4">Ofertas de trabajo</h1>
      {isFetched && !data?.length ? (
        <p>
          😅 Vaya, no hemos encontrado ninguna oferta de trabajo, prueba a
          realizar una búsqueda diferente
        </p>
      ) : null}
      {isLoading && <Loader2 className="animate-spin" />}
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
                  className="rounded self-start w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
                />
              )}
              <div className="flex-1">
                <div className="text-xl font-bold">{x.healthEntity?.name}</div>
                <div className="mb-4 text-sm">
                  {dayjs(x.createdDate).fromNow()} &#8729;{" "}
                  {x.contractType ? getContractTypeLabel(x.contractType) : null}
                </div>
                <div className="text-neutral-500 mb-4 max-h-[120px] overflow-hidden from-current to-transparent">
                  {x.description}
                </div>
                <div className="text-neutral-500 flex items-center text-sm">
                  <MapPin size={16} className="mr-1" /> {x.city} ({x.region})
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
