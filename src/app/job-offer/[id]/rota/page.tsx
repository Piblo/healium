import { ArrowRight, CalendarRange, File } from "lucide-react";
import { differenceInDays, format } from "date-fns";

import { BackButton } from "@/components/BackButton";
import Image from "next/image";
import { JobOfferProps } from "../page";
import Link from "next/link";
import { Status } from "@/components/Status";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";
import { trpc } from "@/trpc/server";

type RotaProps = {
  params: JobOfferProps["params"];
};
export default async function Rota({ params }: RotaProps) {
  const applications = await trpc.jobOffer.applications.query({
    jobOfferId: params.id,
    status: "approved",
    endDate: new Date(),
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

    return "outline";
  }

  function getDurationPercentage() {
    const { startDate, endDate } = applications.at(0) ?? {};
    if (!startDate || !endDate) {
      return 0;
    }

    const totalDays = differenceInDays(startDate, endDate);
    const elapsedDays = differenceInDays(startDate, new Date());

    return (elapsedDays / totalDays) * 100;
  }

  if (!applications.length) {
    return (
      <div className="container py-6">
        <BackButton href="/job-offer/list" className="mb-4" />
        <h1 className="text-2xl font-semibold mb-6">{jobOffer.title}</h1>
        <p>No hay ningún trabajador para este puesto</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <BackButton href="/job-offer/list" className="mb-4" />
      <h1 className="text-2xl font-semibold mb-6">{jobOffer.title}</h1>
      <ul>
        {applications.map((x, index) => (
          <>
            <li
              key={`${x.userId}-${x.jobOfferId}`}
              className="flex relative max-w-screen-md items-start pb-12"
            >
              {index < applications.length - 1 && (
                <VerticalProgress value={getDurationPercentage()} />
              )}
              <div className="flex items-center gap-4 w-full">
                {x.user?.imageUrl && (
                  <Image
                    className={cn(
                      "rounded-full outline-2 outline-offset-2 self-start",
                      getOutlineStyle(),
                      {
                        "outline-blue-500": index === 0,
                        "outline-slate-400": index > 0,
                      }
                    )}
                    width={48}
                    height={48}
                    src={x.user?.imageUrl}
                    alt=""
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-6">
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
                  {x.startDate &&
                    x.startDate <= new Date() &&
                    x.endDate &&
                    x.endDate >= new Date() && (
                      <Status color="green" className="mb-2">
                        En plantilla
                      </Status>
                    )}
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

type VerticalProgressProps = {
  value: number;
};

const VerticalProgress = ({ value }: VerticalProgressProps) => {
  return (
    <div className="absolute left-[24px] w-[2px] h-[calc(100%-(48px+8px))] top-[calc(4px+48px)] bg-slate-400">
      <div
        className="absolute w-full bg-blue-500"
        style={{
          height: `${value}%`,
        }}
      />
    </div>
  );
};
