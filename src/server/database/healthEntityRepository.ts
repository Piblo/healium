import {
  HealthEntity,
  HealthEntityUser,
  healthEntities,
  healthEntityUsers,
  jobApplications,
  jobOffers,
} from "./neon/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "./neon/connection";
import { ulid } from "ulid";

type CreateHealthEntityRequest = {
  healthEntity: Omit<HealthEntity, "id">;
  user: {
    email: string;
    id: string;
  };
};

export async function createHealthEntity(
  request: CreateHealthEntityRequest
): Promise<HealthEntity> {
  return await db.transaction(async (tx) => {
    const healthEntity: HealthEntity = {
      ...request.healthEntity,
      id: ulid(),
    };

    await tx.insert(healthEntities).values(healthEntity);

    await tx.insert(healthEntityUsers).values({
      healthEntityId: healthEntity.id,
      email: request.user.email,
      invitedDate: new Date(),
      status: "accepted",
      acceptedDate: new Date(),
      userId: request.user.id,
    });

    return healthEntity;
  });
}

export async function updateHealthEntity(
  healthEntity: HealthEntity
): Promise<HealthEntity> {
  const { id, ...updateValues } = healthEntity;

  await db
    .update(healthEntities)
    .set(updateValues)
    .where(eq(healthEntities.id, healthEntity.id));

  return healthEntity;
}

export async function getHealthEntity(
  healthEntityId: string
): Promise<HealthEntity | null> {
  const [healthEntity] = await db
    .select()
    .from(healthEntities)
    .where(eq(healthEntities.id, healthEntityId));

  if (!healthEntity) {
    return null;
  }

  return healthEntity;
}

export async function getHealthEntityMembers(
  healthEntityId: string
): Promise<HealthEntityUser[]> {
  const result = await db
    .select()
    .from(healthEntityUsers)
    .innerJoin(
      healthEntities,
      eq(healthEntities.id, healthEntityUsers.healthEntityId)
    )
    .where(eq(healthEntities.id, healthEntityId));

  return result.map((x) => x.users_to_health_entities);
}

type RemoveMemberRequest = {
  healthEntityId: string;
  email: string;
};

export async function removeMember(request: RemoveMemberRequest) {
  await db
    .delete(healthEntityUsers)
    .where(
      and(
        eq(healthEntityUsers.healthEntityId, request.healthEntityId),
        eq(healthEntityUsers.email, request.email)
      )
    );
}

export async function getHealthEntityStats(healthEntityId: string) {
  const pendingApplicationCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(jobApplications)
    .innerJoin(jobOffers, eq(jobOffers.id, jobApplications.jobOfferId))
    .where(
      and(
        eq(jobOffers.healthEntityId, healthEntityId),
        eq(jobApplications.status, "pending")
      )
    );

  const jobOfferCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(jobOffers)
    .where(eq(jobOffers.healthEntityId, healthEntityId));

  const acceptedApplicationCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(jobApplications)
    .innerJoin(jobOffers, eq(jobOffers.id, jobApplications.jobOfferId))
    .where(
      and(
        eq(jobOffers.healthEntityId, healthEntityId),
        eq(jobApplications.status, "approved")
      )
    );

  const activeEmployeesCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(jobApplications)
    .innerJoin(jobOffers, eq(jobOffers.id, jobApplications.jobOfferId))
    .where(
      and(
        eq(jobOffers.healthEntityId, healthEntityId),
        eq(jobApplications.status, "approved"),
        lte(jobApplications.startDate, new Date()),
        gte(jobApplications.endDate, new Date())
      )
    );

  return {
    pendingApplicationCount: pendingApplicationCount.at(0)?.count,
    jobOfferCount: jobOfferCount.at(0)?.count,
    acceptedJobApplicationCount: acceptedApplicationCount.at(0)?.count,
    activeEmployeesCount: activeEmployeesCount.at(0)?.count,
  };
}
