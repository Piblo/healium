import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

import { InferModel } from "drizzle-orm";

export const healthEntities = mysqlTable("health_entities", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
});

export type HealthEntity = InferModel<typeof healthEntities>;
export type NewHealthEntity = InferModel<typeof healthEntities, "insert">; // insert type

export const healthEntityUsers = mysqlTable(
  "users_to_health_entities",
  {
    userId: varchar("user_id", {
      length: 256,
    }).notNull(),
    healthEntityId: varchar("health_entity_id", {
      length: 36,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.healthEntityId, table.userId),
  })
);
