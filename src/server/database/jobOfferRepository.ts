import { CreateJobOffer, JobOffer, jobOffers } from "./schema";
import { SQL, and, eq, like } from "drizzle-orm";

import { db } from "./connection";
import { ulid } from "ulid";

export async function createJobOffer(request: CreateJobOffer) {
  const jobOffer: CreateJobOffer = {
    ...request,
    id: ulid(),
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

type SearchJobOffersRequest = {
  search?: string;
  region?: string;
};

export async function searchJobOffers(request: SearchJobOffersRequest) {
  const where: SQL[] = [];

  if (request.search) {
    where.push(like(jobOffers.title, `%${request.search}%`));
  }

  if (request.region) {
    where.push(eq(jobOffers.region, request.region));
  }

  const result = await db.query.jobOffers.findMany({
    where: and(...where),
    limit: 10,
    with: {
      healthEntity: true,
    },
  });

  return result;
}
