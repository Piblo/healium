import { BackButton } from "@/components/BackButton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-6 max-w-screen-lg">
      <BackButton className="mb-2" href="/health-entity/manage" />
      <h1 className="text-2xl font-bold mb-4">Ofertas publicadas</h1>
      <ul className="space-y-4">
        <li>
          <Skeleton className="w-full h-[200px]" />
        </li>
        <li>
          <Skeleton className="w-full h-[200px]" />
        </li>
        <li>
          <Skeleton className="w-full h-[200px]" />
        </li>
      </ul>
    </div>
  );
}
