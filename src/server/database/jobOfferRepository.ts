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
type UpdateJobOfferRequest = Omit<JobOffer, "createdDate">;

export async function createJobOffer(request: CreateJobOfferRequest) {
  const jobOffer: CreateJobOffer = {
    ...request,
    id: ulid(),
  };

  await db.insert(jobOffers).values(jobOffer);
  return jobOffer;
}

export async function updateJobOffer(request: UpdateJobOfferRequest) {
  await db
    .update(jobOffers)
    .set(request)
    .where(
      and(
        eq(jobOffers.id, request.id),
        eq(jobOffers.healthEntityId, request.healthEntityId)
      )
    );
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
  userId?: string | null;
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
      applications: request.userId
        ? {
            limit: 1,
            where: eq(jobApplications.userId, request.userId),
          }
        : undefined,
    },
    orderBy: (jobOffer, { desc }) => desc(jobOffer.createdDate),
  });

  return result;
}

export async function deleteJobOffer(jobOfferId: string) {
  await db.delete(jobOffers).where(eq(jobOffers.id, jobOfferId));
}
