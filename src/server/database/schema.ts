import { InferModel, relations } from "drizzle-orm";
import {
  date,
  datetime,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const healthEntities = mysqlTable("health_entities", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  logoUrl: text("logo_url"),
});

export type HealthEntity = InferModel<typeof healthEntities>;

export const healthEntityRelations = relations(healthEntities, ({ many }) => ({
  jobOffers: many(jobOffers),
}));

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

export const jobOffers = mysqlTable("job_offers", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  healthEntityId: varchar("health_entity_id", { length: 36 }),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  region: varchar("region", { length: 128 }),
  city: varchar("city", { length: 128 }),
  contractType: mysqlEnum("contract_type", [
    "full-time",
    "part-time",
    "fixed-term",
  ]),
  startDate: date("start_date"),
  endDate: date("end_date"),
  createdDate: timestamp("created_date").notNull().defaultNow(),
});

export type JobOffer = InferModel<typeof jobOffers>;
export type CreateJobOffer = InferModel<typeof jobOffers, "insert">;

export const jobOffersRelations = relations(jobOffers, ({ one, many }) => ({
  healthEntity: one(healthEntities, {
    fields: [jobOffers.healthEntityId],
    references: [healthEntities.id],
  }),
  applications: many(jobOffers),
}));

export const jobApplication = mysqlTable("job_application", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  jobOfferId: varchar("job_offer_id", { length: 36 }),
  userId: varchar("user_id", {
    length: 36,
  }),
  createdDate: timestamp("created_date").notNull().defaultNow(),
});

export const jobApplicationRelations = relations(jobApplication, ({ one }) => ({
  jobOffer: one(jobOffers, {
    fields: [jobApplication.jobOfferId],
    references: [jobOffers.id],
  }),
}));
