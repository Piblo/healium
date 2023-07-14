import { getBaseUrl } from "@/utils/getBaseUrl";

type HealthEntity = {
  id: string;
  name: string;
};

const baseUrl = getBaseUrl();

export async function getHealthEntity(
  healthEntityId: string
): Promise<HealthEntity> {
  const response = await fetch(
    `${baseUrl}/api/health-entity/${healthEntityId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch health entity");
  }

  return await response.json();
}
