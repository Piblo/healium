import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <Skeleton className="w-2/4 h-14" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-3/4 h-32" />
      <Skeleton className="w-1/4 h-10" />
    </div>
  );
}
