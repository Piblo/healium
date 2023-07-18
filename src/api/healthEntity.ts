import { getBaseUrl } from "@/utils/getBaseUrl";
import { makeRequest } from "./makeRequest";

type HealthEntity = {
  id: string;
  name: string;
};

const baseUrl = getBaseUrl();

export async function getHealthEntity(
  healthEntityId: string
): Promise<HealthEntity> {
  return await makeRequest(`${baseUrl}/api/health-entity/${healthEntityId}`);
}
