"use client";

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
  return <div>{JSON.stringify(data)}</div>;
}
