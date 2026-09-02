/* Next reads .env.local; dotenv/config alone reads only .env. Loading both
   here means drizzle-kit and the app never disagree about which database they
   are pointed at — a mismatch that is invisible until a push lands somewhere
   unexpected. */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import type { Config } from "drizzle-kit";

/**
 * One database, one schema file, one migration history.
 *
 * There is no longer a separate API service with its own Drizzle setup — the
 * Express backend was retired when everything moved into this app. If you find
 * a second drizzle.config.ts in this repository, something has regressed.
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
