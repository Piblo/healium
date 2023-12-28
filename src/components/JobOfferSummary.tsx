import { Briefcase, CalendarClock, Check, Euro, MapPin } from "lucide-react";
import { ContractType, getContractTypeLabel } from "@/utils/contractType";

import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import Image from "next/image";
import { JobApplicationStatus } from "./JobApplicationStatus";
import { PropsWithChildren } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale(es);
dayjs.extend(relativeTime);

type JobOfferSummary = {
  title: string;
  healthEntityName: string;
  logo?: string | null;
  createdDate: Date;
  description: string;
  contractType: ContractType;
  city: string;
  region: string;
  hasApplied?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  applicationStatus?: "approved" | "rejected" | "pending";
  hoursPerWeek?: number | null;
  salaryPerHour?: number | null;
  applicationStartDate?: Date | null;
  applicationEndDate?: Date | null;
} & PropsWithChildren;

export const JobOfferSummary = ({
  title,
  healthEntityName,
  logo,
  description,
  createdDate,
  contractType,
  city,
  region,
  children,
  hasApplied,
  startDate,
  endDate,
  applicationStatus,
  hoursPerWeek,
  salaryPerHour,
  applicationEndDate,
  applicationStartDate,
}: JobOfferSummary) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex gap-4">
          {logo && (
            <Image
              src={logo}
              alt=""
              width="80"
              height="80"
              className="rounded self-start w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
            />
          )}
          <div className="flex-1">
            <p className="text-xl font-bold">{healthEntityName}</p>
            <p className="text-muted-foreground">{title}</p>
            {applicationEndDate && applicationStartDate && (
              <p className="text-sm text-muted-foreground mt-4">
                Duración del empleo:{" "}
                {applicationStartDate?.toLocaleDateString("es")} -{" "}
                {applicationEndDate?.toLocaleDateString("es")}
              </p>
            )}
          </div>
          <div className="hidden md:inline text-sm text-muted-foreground">
            <span className="hidden md:inline">Publicado</span>{" "}
            {dayjs(createdDate).fromNow()}
          </div>
        </div>
        <div className="md:hidden text-sm text-muted-foreground">
          {dayjs(createdDate).fromNow()}
        </div>
        <p className="mb-4 line-clamp-3">{description}</p>
        <ul className="dark:text-neutral-300 text-sm flex gap-x-8 gap-y-2 flex-wrap">
          {applicationStatus && (
            <li className="text-muted-foreground">
              <JobApplicationStatus status={applicationStatus} />
            </li>
          )}
          <li className="flex items-center text-muted-foreground">
            <MapPin size={16} className="mr-1" /> {city} ({region})
          </li>
          <li className="flex items-center text-muted-foreground">
            <Briefcase size={16} className="mr-1" />{" "}
            {getContractTypeLabel(contractType)}
            {contractType === "fixed-term" && (
              <span className="ml-1">
                ({startDate?.toLocaleDateString()}
                {endDate ? <> - {endDate.toLocaleDateString()}</> : null})
              </span>
            )}
          </li>
          {hoursPerWeek ? (
            <li className="flex items-center text-muted-foreground">
              <CalendarClock size={16} className="mr-1" /> {hoursPerWeek} horas
              semanales
            </li>
          ) : null}
          {salaryPerHour && (
            <li className="flex items-center text-muted-foreground">
              <Euro size={16} className="mr-1" /> {salaryPerHour}/hora
            </li>
          )}
          {hasApplied && (
            <li>
              <Badge className="bg-teal-500 dark:bg-teal-700 pointer-events-none">
                <Check size={16} className="mr-1" /> Puesto solicitado
              </Badge>
            </li>
          )}
        </ul>
      </div>
      {children}
    </Card>
  );
};
