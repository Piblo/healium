import "dotenv/config";

import { db } from "@/server/database/connection";
import { migrate } from "drizzle-orm/planetscale-serverless/migrator";

async function migrateDb() {
  await migrate(db, { migrationsFolder: "drizzle" });
}

migrateDb();
