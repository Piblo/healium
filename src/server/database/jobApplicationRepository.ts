import { CreateJobApplication, jobApplications, jobOffers } from "./schema";

import { db } from "./connection";
import { eq } from "drizzle-orm";

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
