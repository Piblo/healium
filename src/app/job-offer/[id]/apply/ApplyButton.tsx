"use client";

import { parseAsIsoDateTime, useQueryStates } from "next-usequerystate";

import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type ApplyButtonProps = {
  jobOfferId: string;
};

export const ApplyButton = ({ jobOfferId }: ApplyButtonProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [search] = useQueryStates({
    from: parseAsIsoDateTime.withDefault(new Date()),
    to: parseAsIsoDateTime.withDefault(addDays(new Date(), 7)),
  });

  const { data } = trpc.jobOffer.get.useQuery({ jobOfferId });

  const mutation = trpc.jobOffer.apply.useMutation({
    onSuccess: () => {
      router.push(`/job-offer/${jobOfferId}/apply/confirmed`);
    },
    onError: () => {
      toast({
        title: "Vaya, algo ha salido mal",
        description: "Vuelve a cargar la página y prueba de nuevo",
      });
    },
  });

  function handleClick() {
    mutation.mutate({
      jobOfferId,
      startDate: data?.contractType === "full-time" ? undefined : search.from,
      endDate: data?.contractType === "full-time" ? undefined : search.to,
    });
  }

  return (
    <Button onClick={handleClick} loading={mutation.isLoading}>
      Confirmar solicitud
    </Button>
  );
};
