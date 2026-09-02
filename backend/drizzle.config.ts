/* See src/load-env.ts — the env file lives in frontend/, because that is what
   Next reads and keeping two copies in step is how a script ends up pointed at
   the wrong database. */
import "./src/load-env";
import type { Config } from "drizzle-kit";

/**
 * One database, one schema file, one migration history.
 *
 * There is no longer a separate API service with its own Drizzle setup — the
 * Express backend was retired when everything moved into this app. If you find
 * a second drizzle.config.ts in this repository, something has regressed.
 */
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
