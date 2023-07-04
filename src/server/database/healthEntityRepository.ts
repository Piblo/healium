import { HealthEntity, healthEntities } from "./schema";

import { db } from "./connection";

export async function createHealthEntity(healthEntity: HealthEntity) {
  const result = await db.insert(healthEntities).values(healthEntity);
}
