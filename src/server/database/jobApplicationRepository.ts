import { CreateJobApplication, jobApplications } from "./schema";

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
