import { JobOffer, jobOffers } from "./schema";

import { db } from "./connection";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";

type CreateJobOfferRequest = Omit<JobOffer, "id">;

export async function createJobOffer(request: CreateJobOfferRequest) {
  const jobOffer: JobOffer = {
    id: ulid(),
    ...request,
  };

  await db.insert(jobOffers).values(jobOffer);
  return jobOffer;
}

export async function getJobOffers(
  healthEntityId: string
): Promise<JobOffer[]> {
  return db.query.jobOffers.findMany({
    where: eq(jobOffers.healthEntityId, healthEntityId),
  });
}
