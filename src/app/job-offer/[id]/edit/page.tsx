"use client";

import { JobOfferForm, JobOfferFormValues } from "@/components/JobOfferForm";

import { BackButton } from "@/components/BackButton";
import { Loader2 } from "lucide-react";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  params: { id: string };
};

export default function EditJobOffer({ params }: Props) {
  const { isLoading, data } = trpc.jobOffer.get.useQuery({
    jobOfferId: params.id,
  });
  const { toast } = useToast();
  const mutation = trpc.jobOffer.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Oferta de trabajo modificada",
        description: "La oferta de trabajo ha sido modificada correctamente",
      });
    },
  });
  const healthEntityId = getSelectedHealthEntityId()!;

  function handleSubmit(values: JobOfferFormValues) {
    mutation.mutate({
      city: values.city,
      contractType: values.contract.type,
      description: values.description,
      healthEntityId,
      region: values.region,
      title: values.title,
      endDate: values.contract.endDate,
      startDate: values.contract.startDate,
      id: params.id,
    });
  }

  return (
    <div className="container max-w-md py-4 flex flex-col gap-4">
      <BackButton href="/job-offer/list" />
      <h1 className="text-lg">Editar oferta de trabajo</h1>
      {isLoading && <Loader2 className="animate-spin" />}
      {data && (
        <JobOfferForm
          isSubmitting={mutation.isLoading}
          onSubmit={handleSubmit}
          values={{
            city: data.city ?? "",
            contract: {
              type: data.contractType ?? "fixed-term",
              endDate: data.endDate ?? undefined,
              startDate: data.startDate ?? undefined,
            },
            description: data.description ?? "",
            region: data.region ?? "",
            title: data.title,
          }}
        />
      )}
    </div>
  );
}
