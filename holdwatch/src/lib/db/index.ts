import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";
import * as schema from "./schema";

/**
 * Postgres pool, cached across hot reloads.
 *
 * Next.js re-evaluates modules on every edit in dev, and without the global
 * cache each edit leaks a fresh pool until Postgres refuses connections. The
 * `globalThis` stash is the standard fix and costs nothing in production,
 * where the module is evaluated once per lambda instance.
 */
const globalForDb = globalThis as unknown as { hwPool?: pg.Pool };

export const pool =
  globalForDb.hwPool ??
  new pg.Pool({
    connectionString: env.DATABASE_URL,
    /* Serverless functions each hold their own pool, so keep it small —
       a large max here multiplies by the number of warm instances. */
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (!env.isProduction) globalForDb.hwPool = pool;

pool.on("error", (err) => {
  console.error("[holdwatch/db] idle client error", err);
});

export const db = drizzle(pool, { schema });
export { schema };
