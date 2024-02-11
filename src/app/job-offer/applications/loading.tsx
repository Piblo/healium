import { JobOfferSummarySkeleton } from "@/components/JobOfferSummary";

export default function Loading() {
  return (
    <div className="container max-w-screen-lg py-6">
      <h1 className="text-2xl mb-6">Mis solicitudes de empleo</h1>
      <div className="space-y-4">
        <JobOfferSummarySkeleton />
        <JobOfferSummarySkeleton />
        <JobOfferSummarySkeleton />
      </div>
    </div>
  );
}
