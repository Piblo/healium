import { Card } from "./ui/card";
import { ContractType } from "@/app/job-offer/create/page";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { PropsWithChildren } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { getContractTypeLabel } from "@/utils/contractType";
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
      <div className="flex space-x-4">
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
          <div className="text-xl font-bold">{healthEntityName}</div>
          <div className="mb-4 text-sm space-x-2">
            <span>{dayjs(createdDate).fromNow()}</span>
            <span> &#8226;</span>
            <span>
              {contractType ? getContractTypeLabel(contractType) : null}
            </span>
          </div>
          <div className="text-neutral-500 mb-4 line-clamp-3">
            {description}
          </div>
          <div className="dark:text-neutral-300 flex items-center text-sm">
            <MapPin size={16} className="mr-1" /> {city} ({region})
          </div>
        </div>
      </div>
      {children}
    </Card>
  );
};
