import "./load-env.js";
import { assertEnv, env } from "./env.js";
import { createApp } from "./app.js";
import { closeDb } from "./db/index.js";

/**
 * Boot.
 *
 * The environment is checked before the port is bound, so a misconfigured
 * deploy fails immediately with the name of the missing variable rather than
 * accepting traffic and 500-ing on the first request that touches the database.
 */
assertEnv();

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(
    `[cleanship-api] listening on :${env.PORT} (${env.NODE_ENV})`,
  );
});

/**
 * Render sends SIGTERM and waits before killing the process. Finishing the
 * in-flight requests matters here: half of them are a supervisor's tap on a
 * cell, and dropping one loses work that was done on a deck.
 */
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    console.log(`[cleanship-api] ${signal} received, shutting down`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
    /* If something is wedged, do not hang forever holding the deploy open. */
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
