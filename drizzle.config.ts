import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/server/database/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  breakpoints: true,
  dbCredentials: {
    connectionString: process.env["DATABASE_URL"]!,
  },
} satisfies Config;
