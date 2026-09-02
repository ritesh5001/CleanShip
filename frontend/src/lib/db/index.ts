import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";
import * as schema from "./schema";

/**
 * Postgres, created on first use rather than at import.
 *
 * The pool used to be built at module scope, which meant importing anything
 * from this file demanded a DATABASE_URL — including during Next's build-time
 * page-data collection, where the marketing site has no use for one. Deferring
 * construction is what lets the site build and deploy with no database
 * configured at all.
 *
 * The pool is cached on globalThis because Next re-evaluates modules on every
 * edit in dev; without it each edit leaks a pool until Postgres refuses
 * connections.
 */
const globalForDb = globalThis as unknown as {
  dbPool?: pg.Pool;
  dbClient?: ReturnType<typeof drizzle<typeof schema>>;
};

function connect() {
  if (globalForDb.dbClient) return globalForDb.dbClient;

  const pool =
    globalForDb.dbPool ??
    new pg.Pool({
      connectionString: env.DATABASE_URL,
      /* Each serverless instance holds its own pool, so a large max here
         multiplies by the number of warm instances. */
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

  pool.on("error", (err) => {
    /* An idle client erroring must not take the process down. */
    console.error("[db] idle client error", err);
  });

  const client = drizzle(pool, { schema });
  globalForDb.dbPool = pool;
  globalForDb.dbClient = client;
  return client;
}

/**
 * Reads like the drizzle client; connects on first query.
 *
 * The Proxy keeps every call site as `db.select()…` while deferring the
 * connection — see the note above on why that matters for the build.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop: string) {
    const client = connect() as unknown as Record<string, unknown>;
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/** For scripts that must close the connection to let the process exit. */
export async function closeDb() {
  await globalForDb.dbPool?.end();
  globalForDb.dbPool = undefined;
  globalForDb.dbClient = undefined;
}

export { schema };
