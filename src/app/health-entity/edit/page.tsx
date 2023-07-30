"use client";

import {
  HealthEntityForm,
  HealthEntityFormValues,
} from "@/components/HealthEntityForm";

import { BackButton } from "@/components/BackButton";
import { Loader2 } from "lucide-react";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/components/ui/use-toast";

export default function EditHealthEntity() {
  const healthEntityId = getSelectedHealthEntityId()!;
  const { data, isLoading } = trpc.healthEntity.get.useQuery({
    healthEntityId,
  });

  const { toast } = useToast();

  const mutation = trpc.healthEntity.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Entidad sanitaria actualizada correctamente",
      });
    },
  });

  function handleSubmit(values: HealthEntityFormValues) {
    mutation.mutate({
      id: healthEntityId,
      ...values,
    });
  }

  return (
    <div className="container max-w-md py-4">
      <BackButton className="mb-4" href="/health-entity/manage" />
      <h1 className="text-2xl mb-6">Editar entidad sanitaria</h1>
      {data ? (
        <HealthEntityForm
          onSubmit={handleSubmit}
          values={{
            address: data.address ?? "",
            email: data.email ?? "",
            name: data.name,
            phoneNumber: data.phoneNumber ?? "",
            logoUrl: data.logoUrl,
          }}
          isSubmitting={mutation.isLoading}
          submitButtonText="Guardar cambios"
        />
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </div>
  );
}
