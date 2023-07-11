import { getCookie, setCookie } from "cookies-next";

export function getSelectedHealthEntityId() {
  return getCookie("healthEntityId") as string | undefined;
}

export function setSelectedHealthEntityId(healthEntityId: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  setCookie("healthEntityId", healthEntityId, {
    expires,
  });
}
