"use client";

import {
  HealthEntityForm,
  HealthEntityFormValues,
} from "@/components/HealthEntityForm";

import { CreateHealthEntityRequest } from "@/server/routers/healthEntity";
import { createHealthEntity } from "./actions";
import { setSelectedHealthEntityId } from "@/utils/healthEntity";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function CreateHealthEntity() {
  const mutation = useMutation({
    mutationKey: ["create-health-entity"],
    mutationFn: async (req: CreateHealthEntityRequest) => {
      return createHealthEntity(req);
    },
    onSuccess: (data) => {
      toast({
        title: "Entidad sanitaria creada correctamente",
      });
      setSelectedHealthEntityId(data.id);
      router.push("/health-entity/manage");
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  function handleSubmit(values: HealthEntityFormValues) {
    mutation.mutate({
      ...values,
      registrationNumber: "",
      description: values.description ?? null,
      logoUrl: values.logoUrl ?? null,
    });
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl mb-6">Crear entidad sanitaria</h1>
      <HealthEntityForm
        onSubmit={handleSubmit}
        submitButtonText="Crear entidad"
      />
    </div>
  );
}
