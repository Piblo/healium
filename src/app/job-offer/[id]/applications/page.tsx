"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, File, Loader2, Mail, Phone } from "lucide-react";
import { JobOfferApplicationsOutput, trpc } from "@/trpc/client";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JobApplicationStatus } from "@/components/JobApplicationStatus";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { getPrimaryEmailAddress } from "@/server/utils/user";
import { getQueryKey } from "@trpc/react-query";
import relativeTime from "dayjs/plugin/relativeTime";
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
      queryClient.setQueryData<JobOfferApplicationsOutput>(
        getQueryKey(
          trpc.jobOffer.applications,
          { jobOfferId: params.id },
          "query"
        ),
        (oldData) => {
          const offer = oldData?.find((x) => x.id === data.id);
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

  function setStatus(
    jobApplicationId: string,
    status: "approved" | "rejected"
  ) {
    if (!jobOffer) {
      return;
    }

    mutation.mutate({
      id: jobApplicationId,
      status,
    });
  }

  const pending = applications?.filter((x) => x.status === "pending") ?? [];
  const notPending = applications?.filter((x) => x.status !== "pending") ?? [];

  if (loading) {
    return (
      <div className="container py-6 max-w-screen-lg">
        <BackButton href="/job-offer/list" className="mb-4" />
        {loading && <Loader2 className="animate-spin" />}
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-screen-lg">
      <BackButton href="/job-offer/list" className="mb-4" />
      <h1 className="text-2xl font-semibold mb-6">{jobOffer?.title}</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Pendientes</h2>
        {pending?.length > 0 ? (
          <ul className="space-y-4">
            {pending?.map((x) => (
              <li
                key={x.userId}
                className="flex flex-col gap-4 py-6 border rounded p-4"
              >
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
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <p className="text-lg flex-1">
                        {x.user?.firstName} {x.user?.lastName}{" "}
                      </p>
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
                    <div className="text-muted-foreground text-sm">
                      Solicitado el {dayjs(x.createdDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
                <ul className="dark:text-neutral-300 text-sm flex gap-x-8 gap-y-2 flex-wrap">
                  <li>
                    <JobApplicationStatus status={x.status} />
                  </li>
                  <li className="flex items-center">
                    <Mail size={16} className="mr-1" />
                    {getPrimaryEmailAddress(x.user!)?.emailAddress}
                  </li>
                  {x.startDate && x.endDate && (
                    <li className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Duración: {x.startDate.toLocaleDateString("es")} -{" "}
                      {x.endDate.toLocaleDateString("es")}
                    </li>
                  )}
                  {x.user?.phoneNumbers.length ? (
                    <li className="flex items-center">
                      <Phone size={16} className="mr-1" />
                      {x.user?.phoneNumbers[0].phoneNumber}
                    </li>
                  ) : null}
                </ul>
                <div className="flex gap-4">
                  <Button
                    loading={
                      mutation.isLoading && mutation.variables?.id === x.id
                    }
                    onClick={() => setStatus(x.id, "approved")}
                    disabled={x.status === "approved"}
                  >
                    Aceptar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStatus(x.id, "rejected")}
                    loading={
                      mutation.isLoading && mutation.variables?.id === x.id
                    }
                  >
                    Rechazar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No hay solicitudes pendientes de revision
          </p>
        )}
      </section>
      <h2 className="text-xl font-semibold mb-2">Aprobadas y rechazadas</h2>
      <ul className="divide-y">
        {notPending?.map((x) => (
          <li key={x.userId} className="flex flex-col gap-4 py-6">
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
              <div className="flex-1">
                <div className="flex gap-2">
                  <p className="text-lg flex-1">
                    {x.user?.firstName} {x.user?.lastName}{" "}
                  </p>
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
                <div className="text-muted-foreground text-sm">
                  Solicitado el {dayjs(x.createdDate).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <ul className="dark:text-neutral-300 text-sm flex gap-x-8 gap-y-2 flex-wrap">
              <li>
                <JobApplicationStatus status={x.status} />
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-1" />
                {getPrimaryEmailAddress(x.user!)?.emailAddress}
              </li>
              {x.startDate && x.endDate && (
                <li className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Duración: {x.startDate.toLocaleDateString("es")} -{" "}
                  {x.endDate.toLocaleDateString("es")}
                </li>
              )}
              {x.user?.phoneNumbers.length ? (
                <li className="flex items-center">
                  <Phone size={16} className="mr-1" />
                  {x.user?.phoneNumbers[0].phoneNumber}
                </li>
              ) : null}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
