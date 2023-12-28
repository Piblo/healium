import {
  CreateJobApplication,
  JobApplication,
  jobApplications,
  jobOffers,
} from "./schema";
import { and, desc, eq } from "drizzle-orm";

import { db } from "./connection";

type CreateJobApplicationRequest = Omit<
  CreateJobApplication,
  "id" | "createdDate"
>;

export async function createJobApplication(
  request: CreateJobApplicationRequest
) {
  await db.insert(jobApplications).values(request);

  return request;
}

export async function getJobApplicationsForHealthEntity(
  healthEntityId: string
) {
  const offers = await db
    .select({
      jobOffer: jobOffers,
      jobApplication: jobApplications,
    })
    .from(jobApplications)
    .innerJoin(jobOffers, eq(jobOffers.id, jobApplications.jobOfferId))
    .where(eq(jobOffers.healthEntityId, healthEntityId))
    .limit(10);

  return offers;
}

export async function getJobApplicationsForUser(userId: string) {
  const offers = await db.query.jobApplications.findMany({
    where: eq(jobApplications.userId, userId),
    orderBy: desc(jobApplications.createdDate),
    with: {
      jobOffer: {
        with: {
          healthEntity: true,
        },
      },
    },
    limit: 10,
  });

  return offers;
}

export async function getJobApplicationsForJobOffer(jobOfferId: string) {
  const applications = await db.query.jobApplications.findMany({
    where: eq(jobApplications.jobOfferId, jobOfferId),
    limit: 10,
    with: {
      candidateProfile: true,
    },
  });

  return applications;
}

type SetJobApplicationStatusRequest = {
  jobOfferId: string;
  userId: string;
  status: JobApplication["status"];
};

export async function setJobApplicationStatus(
  request: SetJobApplicationStatusRequest
) {
  await db
    .update(jobApplications)
    .set({ status: request.status })
    .where(
      and(
        eq(jobApplications.userId, request.userId),
        eq(jobApplications.jobOfferId, request.jobOfferId)
      )
    );
}
