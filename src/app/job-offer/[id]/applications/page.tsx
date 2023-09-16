"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, Phone } from "lucide-react";

import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JobApplication } from "@/server/database/schema";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { getPrimaryEmailAddress } from "@/server/utils/user";
import { getQueryKey } from "@trpc/react-query";
import relativeTime from "dayjs/plugin/relativeTime";
import { trpc } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

dayjs.locale(es);
dayjs.extend(relativeTime);

type JobOfferApplicationProps = {
  params: {
    id: string;
  };
};

export default function JobOfferApplications({
  params,
}: JobOfferApplicationProps) {
  const { data: applications, isLoading: isApplicationsLoading } =
    trpc.jobOffer.applications.useQuery({
      jobOfferId: params.id,
    });

  const { data: jobOffer, isLoading: isJobOfferLoading } =
    trpc.jobOffer.get.useQuery({
      jobOfferId: params.id,
    });

  const queryClient = useQueryClient();
  const mutation = trpc.jobApplication.setStatus.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData<typeof applications>(
        getQueryKey(
          trpc.jobOffer.applications,
          { jobOfferId: params.id },
          "query"
        ),
        (oldData) => {
          const offer = oldData?.find((x) => x.userId === data.userId);
          if (!offer) {
            return oldData;
          }

          offer.status = data.status;

          return oldData;
        }
      );
    },
  });

  const loading = isApplicationsLoading || isJobOfferLoading;

  function setStatus(userId: string, status: "approved" | "rejected") {
    if (!jobOffer) {
      return;
    }

    mutation.mutate({
      jobOfferId: jobOffer.id,
      status,
      userId: userId,
    });
  }

  return (
    <div className="container py-4">
      <BackButton href="/job-offer/list" className="mb-2" />
      {loading && <Loader2 className="animate-spin" />}
      <h1 className="text-xl mb-4">{jobOffer?.title}</h1>
      <ul className="divide-y">
        {applications?.map((x) => (
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
              <li className="flex items-center gap-2 text-sm">
                <div
                  className={cn(
                    "rounded-full h-2 w-2",
                    getStatusColor(x.status)
                  )}
                />
                {getApplicationStatusLabel(x.status)}
              </li>
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
              <Button
                loading={mutation.isLoading}
                onClick={() => setStatus(x.userId, "approved")}
                disabled={x.status === "approved"}
              >
                Aceptar
              </Button>
              <Button
                variant="secondary"
                onClick={() => setStatus(x.userId, "rejected")}
              >
                Rechazar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getApplicationStatusLabel(status: JobApplication["status"]) {
  const map: Record<JobApplication["status"], string> = {
    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
  };

  return map[status];
}

function getStatusColor(status: JobApplication["status"]) {
  const map: Record<JobApplication["status"], string> = {
    approved: "bg-green-500",
    pending: "bg-orange-500",
    rejected: "bg-red-500",
  };
  return map[status];
}
