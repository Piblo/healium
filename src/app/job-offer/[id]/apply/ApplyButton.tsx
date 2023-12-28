"use client";

import {
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "next-usequerystate";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type ApplyButtonProps = {
  jobOfferId: string;
};

export const ApplyButton = ({ jobOfferId }: ApplyButtonProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useQueryStates({
    region: parseAsString,
    from: parseAsIsoDateTime,
    to: parseAsIsoDateTime,
  });

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
      endDate: search.to ?? undefined,
      startDate: search.from ?? undefined,
    });
  }

  return (
    <Button onClick={handleClick} loading={mutation.isLoading}>
      Confirmar solicitud
    </Button>
  );
};
