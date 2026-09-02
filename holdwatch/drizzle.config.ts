import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  /* Hold Watch shares a Postgres instance with the marketing API. Every table
     is prefixed `hw_` so the two schemas cannot collide, and so a `drizzle-kit
     push` from here can never drop a table belonging to the other service. */
  tablesFilter: ["hw_*"],
} satisfies Config;
