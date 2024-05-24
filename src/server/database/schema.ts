import {
  date,
  decimal,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { ulid } from "ulid";

export const healthEntities = pgTable("health_entities", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  logoUrl: text("logo_url"),
  address: text("address"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  email: varchar("email", { length: 255 }),
  registrationNumber: varchar("registration_number", {
    length: 100,
  }),
  description: text("description"),
});

export type HealthEntity = typeof healthEntities.$inferSelect;

export const healthEntityRelations = relations(healthEntities, ({ many }) => ({
  jobOffers: many(jobOffers),
}));

export const healthEntityUserStatusEnum = pgEnum("health_entity_user_status", [
  "pending",
  "accepted",
]);

export const healthEntityUsers = pgTable(
  "users_to_health_entities",
  {
    email: varchar("email", {
      length: 256,
    }).notNull(),
    healthEntityId: varchar("health_entity_id", {
      length: 36,
    })
      .references(() => healthEntities.id, { onDelete: "cascade" })
      .notNull(),
    invitedDate: timestamp("invited_date", { mode: "date" })
      .defaultNow()
      .notNull(),
    acceptedDate: timestamp("accepted_date", { mode: "date" }),
    status: healthEntityUserStatusEnum("status"),
    userId: varchar("user_id", {
      length: 256,
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.healthEntityId, table.email] }),
  })
);

export type HealthEntityUser = typeof healthEntityUsers.$inferSelect;

export const contractType = pgEnum("contract_type", [
  "full-time",
  "part-time",
  "fixed-term",
]);

export const jobOffers = pgTable("job_offers", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  healthEntityId: varchar("health_entity_id", { length: 36 })
    .references(() => healthEntities.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  region: varchar("region", { length: 128 }),
  city: varchar("city", { length: 128 }),
  contractType: contractType("contract_type").notNull(),
  startDate: date("start_date", { mode: "date" }),
  endDate: date("end_date", { mode: "date" }),
  createdDate: timestamp("created_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  hoursPerWeek: decimal("hours_per_week", {
    precision: 5,
    scale: 2,
  }),
  salaryPerHour: decimal("salaryPerHour", {
    precision: 15,
    scale: 2,
  }),
});

export type JobOffer = typeof jobOffers.$inferSelect;
export type CreateJobOffer = typeof jobOffers.$inferInsert;

export const jobOffersRelations = relations(jobOffers, ({ one, many }) => ({
  healthEntity: one(healthEntities, {
    fields: [jobOffers.healthEntityId],
    references: [healthEntities.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationStatus = pgEnum("job_application_status", [
  "pending",
  "approved",
  "rejected",
]);

export const jobApplications = pgTable("job_applications", {
  id: varchar("id", {
    length: 36,
  })
    .$default(() => ulid())
    .primaryKey(),
  jobOfferId: varchar("job_offer_id", { length: 36 })
    .references(() => jobOffers.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", {
    length: 36,
  }).notNull(),
  createdDate: timestamp("created_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  status: jobApplicationStatus("status").notNull().default("pending"),
  startDate: date("start_date", { mode: "date" }),
  endDate: date("end_date", { mode: "date" }),
});

export const selectJobApplicationSchema = createSelectSchema(jobApplications);

export type JobApplication = typeof jobApplications.$inferSelect;
export type CreateJobApplication = typeof jobApplications.$inferInsert;

export const jobApplicationRelations = relations(
  jobApplications,
  ({ one }) => ({
    jobOffer: one(jobOffers, {
      fields: [jobApplications.jobOfferId],
      references: [jobOffers.id],
    }),
    candidateProfile: one(candidateProfiles, {
      fields: [jobApplications.userId],
      references: [candidateProfiles.userId],
    }),
  })
);

export const candidateProfiles = pgTable("candidate_profiles", {
  userId: varchar("user_id", {
    length: 36,
  }).primaryKey(),
  curriculumVitaeUrl: text("curriculum_vitae_url"),
  curriculumVitaeName: text("curriculum_vitae_name"),
});

export type CandidateProfile = typeof candidateProfiles.$inferSelect;
export type CandidateProfileInsert = typeof candidateProfiles.$inferInsert;
