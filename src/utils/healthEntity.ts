import { getCookie, setCookie } from "cookies-next";

import { trpc } from "@/trpc/client";

export function getSelectedHealthEntityId() {
  const { data } = trpc.user.healthEntities.useQuery();
  if (data?.length === 1) {
    const healthEntityId = data.at(0)?.id;
    setSelectedHealthEntityId(healthEntityId ?? "");
    return healthEntityId;
  }

  return getCookie("healthEntityId") as string | undefined;
}

export function setSelectedHealthEntityId(healthEntityId: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  setCookie("healthEntityId", healthEntityId, {
    expires,
  });
}
