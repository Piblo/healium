"use client";

import { JobOfferSummary } from "@/components/JobOfferSummary";
import { Loader2 } from "lucide-react";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import { trpc } from "@/trpc/client";

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
            <a href={`/job-offer/${x.id}`}>
              <JobOfferSummary
                city={x.city ?? ""}
                contractType={x.contractType ?? "full-time"}
                createdDate={x.createdDate}
                description={x.description ?? ""}
                healthEntityName={x.healthEntity.name}
                region={x.region ?? ""}
                title={x.title}
                logo={x.healthEntity.logoUrl}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
