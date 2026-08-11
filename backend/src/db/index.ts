import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

/**
 * Postgres pool.
 *
 * `pg` is used rather than Neon's HTTP driver because this is a long-running
 * Express process, not a serverless function — a real pool is the right shape,
 * and it keeps the service portable to any Postgres (Neon, Supabase, RDS,
 * local) by connection string alone.
 */
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  // Neon terminates idle connections; keep the pool modest and let it recycle.
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (err) => {
  // An idle client erroring must not take the process down.
  console.error("[db] idle client error", err);
});

export const db = drizzle(pool, { schema });

export async function closeDb() {
  await pool.end();
}
