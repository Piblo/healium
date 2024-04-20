import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/server/database/neon/schema.ts",
  out: "./drizzle",
  driver: "pg",
  breakpoints: true,
  dbCredentials: {
    connectionString: process.env["NEON_DATABASE_URL"]!,
  },
} satisfies Config;
