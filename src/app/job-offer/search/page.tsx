"use client";

import {
  JobOfferSummary,
  JobOfferSummarySkeleton,
} from "@/components/JobOfferSummary";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import { trpc } from "@/trpc/client";

type SearchJobOfferProps = {
  searchParams: {
    region?: string;
    from?: string;
    to?: string;
  };
};

export default function SearchJobOffer({ searchParams }: SearchJobOfferProps) {
  const { data, isLoading, isFetched, fetchNextPage, hasNextPage } =
    trpc.jobOffer.search.useInfiniteQuery(
      {
        region: searchParams.region,
        limit: 10,
        from: searchParams.from ? new Date(searchParams.from) : undefined,
        to: searchParams.to ? new Date(searchParams.to) : undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const items = data?.pages.map((x) => x.items).flat();

  return (
    <div className="container max-w-4xl py-6">
      <SearchOfferForm className="mb-6" />
      <h1 className="text-2xl font-semibold mb-4">Ofertas de trabajo</h1>
      {isFetched && !items?.length ? (
        <p>
          😅 Vaya, no hemos encontrado ninguna oferta de trabajo, prueba a
          realizar una búsqueda diferente
        </p>
      ) : null}
      <ul className="space-y-4">
        {isLoading && (
          <>
            <JobOfferSummarySkeleton />
            <JobOfferSummarySkeleton />
            <JobOfferSummarySkeleton />
          </>
        )}
        {items?.map((x) => (
          <li key={x.id}>
            <Link href={`/job-offer/${x.id}`}>
              <JobOfferSummary
                id={x.id}
                city={x.city ?? ""}
                contractType={x.contractType ?? "full-time"}
                createdDate={x.createdDate}
                description={x.description ?? ""}
                healthEntityName={x.healthEntity.name}
                healthEntityId={x.healthEntityId}
                region={x.region ?? ""}
                title={x.title}
                logo={x.healthEntity.logoUrl}
                hasApplied={x.applications?.length > 0}
                endDate={x.endDate}
                startDate={x.startDate}
                hoursPerWeek={x.hoursPerWeek}
                salaryPerHour={x.salaryPerHour ? Number(x.salaryPerHour) : null}
              />
            </Link>
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
