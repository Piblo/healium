import { getBaseUrl } from "@/utils/getBaseUrl";
import { makeRequest } from "./makeRequest";

export async function getJobOffers(healthEntityId: string) {
  return await makeRequest(
    `${getBaseUrl()}/api/health-entity/${healthEntityId}/job-offers`
  );
}
