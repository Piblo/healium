import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { InferModel } from "drizzle-orm";

export const healthEntities = mysqlTable("HealthEntities", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
});

export type HealthEntity = InferModel<typeof healthEntities>;
export type NewHealthEntity = InferModel<typeof healthEntities, "insert">; // insert type
