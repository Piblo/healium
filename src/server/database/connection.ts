import * as schema from "./schema";

import { Pool, neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const poolDb = drizzleServerless(pool, {
  schema,
});
