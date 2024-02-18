import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  date,
  datetime,
  decimal,
  double,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { createSelectSchema } from "drizzle-zod";
import { ulid } from "ulid";

export const healthEntities = mysqlTable("health_entities", {
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

export type HealthEntity = InferSelectModel<typeof healthEntities>;

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

export type HealthEntityUser = InferSelectModel<typeof healthEntityUsers>;

export const jobOffers = mysqlTable("job_offers", {
  id: varchar("id", {
    length: 36,
  }).primaryKey(),
  healthEntityId: varchar("health_entity_id", { length: 36 }).notNull(),
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
  createdDate: timestamp("created_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), //https://stackoverflow.com/questions/76678778/drizzle-timestamp-datenow-invalid-default-value
  hoursPerWeek: double("hours_per_week", {
    precision: 5,
    scale: 2,
  }),
  salaryPerHour: decimal("salaryPerHour", {
    precision: 15,
    scale: 2,
  }),
});

export type JobOffer = InferSelectModel<typeof jobOffers>;
export type CreateJobOffer = InferInsertModel<typeof jobOffers>;

export const jobOffersRelations = relations(jobOffers, ({ one, many }) => ({
  healthEntity: one(healthEntities, {
    fields: [jobOffers.healthEntityId],
    references: [healthEntities.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplications = mysqlTable("job_applications", {
  id: varchar("id", {
    length: 36,
  })
    .$default(() => ulid())
    .primaryKey(),
  jobOfferId: varchar("job_offer_id", { length: 36 }).notNull(),
  userId: varchar("user_id", {
    length: 36,
  }).notNull(),
  createdDate: timestamp("created_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), //https://stackoverflow.com/questions/76678778/drizzle-timestamp-datenow-invalid-default-value
  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .notNull()
    .default("pending"),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

export const selectJobApplicationSchema = createSelectSchema(jobApplications);

export type JobApplication = InferSelectModel<typeof jobApplications>;
export type CreateJobApplication = InferInsertModel<typeof jobApplications>;

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

export const candidateProfiles = mysqlTable("candidate_profiles", {
  userId: varchar("user_id", {
    length: 36,
  }).primaryKey(),
  curriculumVitaeUrl: text("curriculum_vitae_url"),
  curriculumVitaeName: text("curriculum_vitae_name"),
});

export type CandidateProfile = InferSelectModel<typeof candidateProfiles>;
export type CandidateProfileInsert = InferInsertModel<typeof candidateProfiles>;
