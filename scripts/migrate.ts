import "dotenv/config";

import { db } from "@/server/database/connection";
import { migrate } from "drizzle-orm/planetscale-serverless/migrator";

async function migrateDb() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.info("DB migrated successfully");
  } catch (error) {
    console.error("Failed to migrate DB", error);
  }
}

migrateDb();
