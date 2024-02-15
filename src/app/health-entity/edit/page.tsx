"use client";

import {
  HealthEntityForm,
  HealthEntityFormValues,
} from "@/components/HealthEntityForm";

import { BackButton } from "@/components/BackButton";
import { Loader2 } from "lucide-react";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function EditHealthEntity() {
  const healthEntityId = getSelectedHealthEntityId()!;
  const { data } = trpc.healthEntity.get.useQuery({
    healthEntityId,
  });

  const { toast } = useToast();
  const router = useRouter();

  const mutation = trpc.healthEntity.update.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Entidad sanitaria actualizada correctamente",
      });
    },
  });

  function handleSubmit(values: HealthEntityFormValues) {
    mutation.mutate({
      id: healthEntityId,
      registrationNumber: "",
      ...values,
      description: values.description ?? null,
    });
  }

  return (
    <div className="container max-w-md mx-auto py-6">
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
            description: data.description ?? "",
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
