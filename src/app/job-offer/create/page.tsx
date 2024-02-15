"use client";

import { JobOfferForm, JobOfferFormValues } from "@/components/JobOfferForm";

import { BackButton } from "@/components/BackButton";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";
import { useToast } from "@/components/ui/use-toast";

export default function CreateJobOffer() {
  const healthEntityId = getSelectedHealthEntityId()!;

  const { toast } = useToast();

  const mutation = trpc.jobOffer.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Oferta de trabajo creada",
        description: "La oferta de trabajo se ha creado correctamente",
      });
    },
  });

  function onSubmit(values: JobOfferFormValues) {
    mutation.mutate({
      city: values.city,
      contractType: values.contract.type,
      description: values.description,
      healthEntityId: healthEntityId,
      region: values.region,
      title: values.title,
      endDate: values.contract.endDate,
      startDate: values.contract.startDate,
      hoursPerWeek: values.hoursPerWeek,
      salaryPerHour: values.salaryPerHour,
    });
  }

  return (
    <div className="container py-6 max-w-lg mx-auto">
      <BackButton href="/health-entity/manage" className="mb-4" />
      <h1 className="text-2xl mb-8">Crear nueva oferta</h1>
      <JobOfferForm
        onSubmit={onSubmit}
        isSubmitting={mutation.isLoading}
        submitButtonLabel="Crear oferta de trabajo"
      />
    </div>
  );
}
