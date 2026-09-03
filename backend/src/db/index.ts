import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

/**
 * Postgres, created on first use rather than at import.
 *
 * Deferring construction keeps `import { db }` free of side effects, which is
 * what lets the migration runner, the seed script and the tests import this
 * module without a live database sitting behind every one of them.
 */
let pool: pg.Pool | undefined;
let client: ReturnType<typeof drizzle<typeof schema>> | undefined;

function connect() {
  if (client) return client;

  pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    /* Render's managed Postgres terminates TLS with its own CA. Verifying it
       from outside their network fails, so external connections use the
       ?sslmode=require in the URL and skip chain verification here. Internal
       URLs (the ones Render hands you for same-region services) carry no TLS
       at all, which is why this is conditional rather than always on. */
    ...(env.DATABASE_URL.includes("sslmode=require")
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  });

  pool.on("error", (err) => {
    /* An idle client erroring must not take the process down. */
    console.error("[db] idle client error", err);
  });

  client = drizzle(pool, { schema });
  return client;
}

/** Reads like the drizzle client; connects on first query. */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop: string) {
    const c = connect() as unknown as Record<string, unknown>;
    const value = c[prop];
    return typeof value === "function" ? value.bind(c) : value;
  },
});

/** Raw pool, for the migration runner and the health check. */
export function rawPool() {
  connect();
  return pool!;
}

/** Lets scripts close the connection so the process can exit. */
export async function closeDb() {
  await pool?.end();
  pool = undefined;
  client = undefined;
}

export { schema };
