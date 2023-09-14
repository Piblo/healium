import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { getPrimaryEmailAddress } from "@/server/utils/user";
import relativeTime from "dayjs/plugin/relativeTime";
import { trpc } from "@/trpc/server";

dayjs.locale(es);
dayjs.extend(relativeTime);

type JobOfferApplicationProps = {
  params: {
    id: string;
  };
};

export default async function JobOfferApplications({
  params,
}: JobOfferApplicationProps) {
  const applications = await trpc.jobOffer.applications.query({
    jobOfferId: params.id,
  });

  const jobOffer = await trpc.jobOffer.get.query({
    jobOfferId: params.id,
  });

  return (
    <div className="container max-w-lg py-4">
      <h1 className="text-xl mb-4">{jobOffer?.title}</h1>
      <ul className="divide-y">
        {applications.map((x) => (
          <li key={x.userId} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage asChild src={x.user?.imageUrl!}>
                  <Image
                    width={40}
                    height={40}
                    src={x.user?.imageUrl!}
                    alt=""
                  />
                </AvatarImage>
                <AvatarFallback>
                  {x.user?.firstName?.at(0)}
                  {x.user?.lastName?.at(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">
                  {x.user?.firstName} {x.user?.lastName}
                </p>
                <div className="text-muted-foreground text-sm">
                  Solicitado {dayjs(x.createdDate).fromNow()}
                </div>
              </div>
            </div>
            <ul className="dark:text-neutral-300 text-sm flex gap-x-8 gap-y-2 flex-wrap">
              <li className="flex items-center">
                <Mail size={16} className="mr-1" />
                {getPrimaryEmailAddress(x.user!)?.emailAddress}
              </li>
              {x.user?.phoneNumbers.length ? (
                <li className="flex items-center">
                  <Phone size={16} className="mr-1" />
                  {x.user?.phoneNumbers[0].phoneNumber}
                </li>
              ) : null}
            </ul>
            <div className="flex gap-4">
              <Button>Aceptar</Button>
              <Button variant="secondary">Rechazar</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
