import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-6 max-w-lg">
      <h1 className="text-xl mb-4">Elige una entidad sanitaria</h1>
      <div className="space-y-2 flex flex-col gap-2">
        <Skeleton className="h-[114px] w-full" />
      </div>
    </div>
  );
}
