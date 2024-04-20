import {
  CreateJobOffer,
  JobOffer,
  jobApplications,
  jobOffers,
} from "./neon/schema";
import {
  SQL,
  and,
  count,
  desc,
  eq,
  gt,
  like,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";

import { PaginatedResult } from "@/models/PaginatedResult";
import { db } from "./neon/connection";
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
  const pendingApplicationCount = db
    .select({
      jobOfferId: jobApplications.jobOfferId,
      count: count().as("pendingApplicationCount"),
    })
    .from(jobApplications)
    .where(eq(jobApplications.status, "pending"))
    .groupBy(jobApplications.jobOfferId)
    .as("pendingApplicationCount");

  const results = await db
    .select({
      jobOffer: jobOffers,
      pendingApplicationCount: sql<number>`COALESCE(${pendingApplicationCount.count}, 0)`,
    })
    .from(jobOffers)
    .leftJoin(
      pendingApplicationCount,
      eq(pendingApplicationCount.jobOfferId, jobOffers.id)
    )
    .where(eq(jobOffers.healthEntityId, healthEntityId))
    .orderBy(desc(jobOffers.createdDate));

  return results;
}

type SearchJobOffersRequest = {
  search?: string;
  region?: string;
  userId?: string | null;
  limit?: number;
  cursor?: string;
  from?: Date;
  to?: Date;
};

export async function searchJobOffers(request: SearchJobOffersRequest) {
  const where: Array<SQL | undefined> = [];
  if (request.limit && request.limit > 50) {
    throw new Error("Fetching more than 50 items per page is not allowed");
  }

  if (request.search) {
    where.push(like(jobOffers.title, `%${request.search}%`));
  }

  if (request.region) {
    where.push(eq(jobOffers.region, request.region));
  }

  if (request.cursor) {
    where.push(lte(jobOffers.id, request.cursor));
  }

  const limit = request.limit ?? 50;

  const result = await db.query.jobOffers.findMany({
    where: (jobOffers, { notExists }) =>
      and(
        ...where,
        (request.from || request.to) &&
          notExists(
            db
              .select()
              .from(jobApplications)
              .where(
                and(
                  eq(jobApplications.jobOfferId, jobOffers.id),
                  eq(jobApplications.status, "approved"),
                  or(
                    and(
                      request.from &&
                        gt(
                          jobApplications.startDate,
                          request.from.toISOString()
                        ),
                      request.to &&
                        lt(jobApplications.endDate, request.to.toISOString())
                    ),
                    and(
                      request.from &&
                        lt(
                          jobApplications.startDate,
                          request.from.toISOString()
                        ),
                      request.from &&
                        gt(jobApplications.endDate, request.from.toISOString())
                    ),
                    and(
                      request.to &&
                        gt(jobApplications.startDate, request.to.toISOString()),
                      request.to &&
                        lt(jobApplications.endDate, request.to.toISOString())
                    )
                  )
                )
              )
          )
      ),
    limit: limit + 1,
    with: {
      healthEntity: {
        columns: {
          name: true,
          id: true,
          logoUrl: true,
        },
      },
      applications: request.userId
        ? {
            limit: 1,
            where: eq(jobApplications.userId, request.userId),
          }
        : undefined,
    },
    orderBy: (jobOffer, { desc }) => [desc(jobOffer.id)],
  });

  let nextCursor;

  if (result.length > limit) {
    nextCursor = result.pop()?.id;
  }

  const paginatedResult: PaginatedResult<(typeof result)[number]> = {
    items: result,
    nextCursor,
  };

  return paginatedResult;
}

export async function deleteJobOffer(jobOfferId: string) {
  await db.delete(jobOffers).where(eq(jobOffers.id, jobOfferId));
}
