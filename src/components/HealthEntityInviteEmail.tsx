import { Button } from "./ui/button";
import { getBaseUrl } from "@/utils/getBaseUrl";

type HealthEntityInviteEmail = {
  healthEntityName: string;
  healthEntityId: string;
};

export const HealthEntityInviteEmail = ({
  healthEntityName,
  healthEntityId,
}: HealthEntityInviteEmail) => {
  return (
    <div>
      <h1 className="text-2xl mb-4">Bienvenido a Healium</h1>
      <p>Has sido invitado a administrar {healthEntityName}</p>
      <Button asChild>
        <a href={`${getBaseUrl()}/health-entity/${healthEntityId}/join`}>
          Aceptar invitación
        </a>
      </Button>
    </div>
  );
};
