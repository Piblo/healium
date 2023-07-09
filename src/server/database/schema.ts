import {
  date,
  datetime,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

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
    email: varchar("email", {
      length: 256,
    }).notNull(),
    healthEntityId: varchar("health_entity_id", {
      length: 36,
    }).notNull(),
    invitedDate: datetime("invited_date").notNull(),
    acceptedDate: datetime("accepted_date"),
    status: mysqlEnum("status", ["pending", "accepted"]).notNull(),
    userId: varchar("user_id", {
      length: 256,
    }),
  },
  (table) => ({
    pk: primaryKey(table.healthEntityId, table.email),
  })
);

export type HealthEntityUser = InferModel<typeof healthEntityUsers>;
