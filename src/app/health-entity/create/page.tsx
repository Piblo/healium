"use client";

import {
  HealthEntityForm,
  HealthEntityFormValues,
} from "@/components/HealthEntityForm";

import { trpc } from "@/trpc/client";
import { useToast } from "@/components/ui/use-toast";

export default function CreateHealthEntity() {
  const mutation = trpc.healthEntity.create.useMutation();
  const { toast } = useToast();

  async function handleSubmit(values: HealthEntityFormValues) {
    await mutation.mutateAsync({ ...values, registrationNumber: "" });
    toast({
      title: "Entidad sanitaria creada correctamente",
    });
  }

  return (
    <div className="container max-w-sm mx-auto p-4">
      <h1 className="text-xl mb-6">Crear entidad sanitaria</h1>
      <HealthEntityForm
        onSubmit={handleSubmit}
        submitButtonText="Crear entidad"
      />
    </div>
  );
}
