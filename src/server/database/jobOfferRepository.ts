import {
  CreateJobOffer,
  JobOffer,
  healthEntities,
  jobApplications,
  jobOffers,
} from "./schema";
import { SQL, and, eq, like, sql } from "drizzle-orm";

import { db } from "./connection";
import { ulid } from "ulid";

type CreateJobOfferRequest = Omit<CreateJobOffer, "id">;

export async function createJobOffer(request: CreateJobOfferRequest) {
  const jobOffer: CreateJobOffer = {
    ...request,
    id: ulid(),
  };

  await db.insert(jobOffers).values(jobOffer);
  return jobOffer;
}

export async function getJobOffer(jobOfferId: string) {
  const jobOffer = await db.query.jobOffers.findFirst({
    with: {
      healthEntity: true,
    },
    where: eq(jobOffers.id, jobOfferId),
  });

  return jobOffer;
}

export async function getJobOffers(healthEntityId: string) {
  const results = await db
    .select({
      jobOffer: jobOffers,
      applicationsCount: sql<number>`count(${jobApplications.userId})`,
    })
    .from(jobOffers)
    .innerJoin(healthEntities, eq(healthEntities.id, jobOffers.healthEntityId))
    .leftJoin(jobApplications, eq(jobApplications.jobOfferId, jobOffers.id))
    .groupBy(jobApplications.jobOfferId, jobOffers.id)
    .where(eq(healthEntities.id, healthEntityId));

  return results;
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
    orderBy: (jobOffer, { desc }) => desc(jobOffer.createdDate),
  });

  return result;
}

export async function deleteJobOffer(jobOfferId: string) {
  await db.delete(jobOffers).where(eq(jobOffers.id, jobOfferId));
}
