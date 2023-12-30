import { ArrowRight, CalendarRange, File } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import Image from "next/image";
import { JobOfferProps } from "../page";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { trpc } from "@/trpc/server";

type RotaProps = {
  params: JobOfferProps["params"];
};
export default async function Rota({ params }: RotaProps) {
  const applications = await trpc.jobOffer.applications.query({
    jobOfferId: params.id,
    status: "approved",
  });

  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  function getOutlineStyle() {
    const startDate = applications.at(0)?.startDate;

    if (!startDate) {
      return "outline-dashed";
    }

    if (startDate <= new Date()) {
      return "outline";
    }

    return "outline-dashed";
  }

  return (
    <div className="container py-6">
      <BackButton href={`/job-offer/list`} className="mb-4" />
      <h1 className="text-2xl font-semibold mb-6">{jobOffer.title}</h1>
      <ul>
        {applications.map((x, index) => (
          <>
            <li
              key={`${x.userId}-${x.jobOfferId}`}
              className={cn("flex relative max-w-screen-md", {
                "after:absolute after:left-[24px] after:top-[48px] after:w-[1px] after:h-full after:bg-slate-600 mb-12":
                  index < applications.length - 1,
              })}
            >
              <div className="flex items-center gap-4 w-full">
                {x.user?.imageUrl && (
                  <Image
                    className={cn(
                      "rounded-full outline-2 outline-offset-2 outline-blue-500",
                      index === 0 && getOutlineStyle()
                    )}
                    width={48}
                    height={48}
                    src={x.user?.imageUrl}
                    alt=""
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-6 mb-2">
                    <h2 className="text-lg font-semibold">
                      {x.user?.firstName} {x.user?.lastName}
                    </h2>
                    {x.candidateProfile?.curriculumVitaeUrl && (
                      <Link
                        className={badgeVariants({ variant: "secondary" })}
                        href={x.candidateProfile.curriculumVitaeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <File className="mr-1" size={16} />
                        Ver CV
                      </Link>
                    )}
                  </div>
                  {x.startDate && x.endDate && (
                    <span className="flex items-center text-muted-foreground capitalize text-sm">
                      <CalendarRange className="h-4 w-4 mr-2" />
                      <span className="hidden sm:block">
                        {format(x.startDate, "dd MMMM yyyy", { locale: es })}
                      </span>
                      <span className="sm:hidden">
                        {format(x.startDate, "dd/MM/yyyy", { locale: es })}
                      </span>
                      <ArrowRight className="h-4" />
                      <span className="hidden sm:block">
                        {format(x.endDate, "dd MMMM yyyy", { locale: es })}
                      </span>
                      <span className="sm:hidden">
                        {format(x.endDate, "dd/MM/yyyy", { locale: es })}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
}
