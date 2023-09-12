import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
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
      <ul>
        {applications.map((x) => (
          <li key={x.userId} className="flex gap-4">
            <Avatar>
              <AvatarImage asChild src={x.user?.imageUrl!}>
                <Image width={40} height={40} src={x.user?.imageUrl!} alt="" />
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
          </li>
        ))}
      </ul>
    </div>
  );
}
