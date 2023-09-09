import { Briefcase, MapPin } from "lucide-react";
import { ContractType, getContractTypeLabel } from "@/utils/contractType";

import { Card } from "./ui/card";
import Image from "next/image";
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
            <p>{title}</p>
          </div>
          <div className="hidden md:inline text-sm text-neutral-500">
            <span className="hidden md:inline">Publicado</span>{" "}
            {dayjs(createdDate).fromNow()}
          </div>
        </div>
        <div className="md:hidden text-sm text-neutral-500">
          {dayjs(createdDate).fromNow()}
        </div>
        <p className="text-neutral-500 mb-4 line-clamp-3">{description}</p>
        <ul className="dark:text-neutral-300 text-sm flex gap-8">
          <li className="flex items-center">
            <MapPin size={16} className="mr-1" /> {city} ({region})
          </li>
          <li className="flex items-center">
            <Briefcase size={16} className="mr-1" />{" "}
            {getContractTypeLabel(contractType)}
          </li>
        </ul>
      </div>
      {children}
    </Card>
  );
};
