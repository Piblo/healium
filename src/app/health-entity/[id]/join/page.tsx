"use client";

import { Button } from "@/components/ui/button";
import { setCookie } from "cookies-next";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { data } = trpc.healthEntity.get.useQuery({
    healthEntityId: params.id,
  });

  const router = useRouter();

  const mutation = trpc.healthEntity.acceptInvitation.useMutation({
    onSuccess: () => {
      setCookie("healthEntityId", params.id);
      router.push(`/health-entity/manage`);
    },
  });

  return (
    <div className="container py-4">
      <h1 className="text-2xl mb-6">Bienvenido a Healium</h1>
      <p className="mb-4">
        {data?.name} te ha enviado una invitación para unirte a Healium y
        administrar la entidad sanitaria
      </p>
      <Button
        onClick={async () =>
          mutation.mutate({
            healthEntityId: params.id,
          })
        }
      >
        Aceptar invitación
      </Button>
    </div>
  );
}
