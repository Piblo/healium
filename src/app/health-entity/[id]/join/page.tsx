"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { trpc } from "@/trpc/client";
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
    <div className="container py-6">
      <h1 className="text-2xl mb-6">Bienvenido a Healium</h1>
      {data?.logoUrl && (
        <Image
          className="rounded mb-4"
          width={92}
          height={92}
          src={data?.logoUrl}
          alt=""
        />
      )}
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
