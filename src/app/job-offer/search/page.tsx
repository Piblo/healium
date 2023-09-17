"use client";

import { Button } from "@/components/ui/button";
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
  const { data, isLoading, isFetched, fetchNextPage, hasNextPage } =
    trpc.jobOffer.search.useInfiniteQuery(
      {
        region: searchParams.region,
        search: searchParams.search,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const items = data?.pages.map((x) => x.items).flat();

  return (
    <div className="container max-w-4xl py-6">
      <SearchOfferForm className="mb-6" />
      <h1 className="text-2xl mb-4">Ofertas de trabajo</h1>
      {isFetched && !items?.length ? (
        <p>
          😅 Vaya, no hemos encontrado ninguna oferta de trabajo, prueba a
          realizar una búsqueda diferente
        </p>
      ) : null}
      {isLoading && <Loader2 className="animate-spin" />}
      <ul className="space-y-4">
        {items?.map((x) => (
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
                hasApplied={x.applications?.length > 0}
                endDate={x.endDate}
                startDate={x.startDate}
              />
            </a>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => fetchNextPage()}
        >
          Cargar mas
        </Button>
      )}
    </div>
  );
}
