import * as schema from "./schema";

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

// const sql = neon(process.env.NEON_DATABASE_URL!);
const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL! });
export const db = drizzle(pool, {
  schema,
});
