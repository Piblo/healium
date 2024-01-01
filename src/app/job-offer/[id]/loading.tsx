import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <Skeleton className="w-2/4 h-14" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-2/5 h-28" />
      <Skeleton className="w-1/5 h-12" />
    </div>
  );
}
