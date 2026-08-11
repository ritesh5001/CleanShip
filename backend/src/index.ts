import { createApp } from "./app.js";
import { closeDb } from "./db/index.js";
import { env } from "./env.js";

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(
    `[api] cleanship-api listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});

/**
 * Graceful shutdown. Platforms send SIGTERM on deploy; without this the
 * process is killed mid-request and the Postgres pool leaks connections,
 * which Neon counts against the project's connection limit.
 */
function shutdown(signal: string) {
  console.log(`[api] ${signal} received, shutting down`);
  server.close(async () => {
    await closeDb();
    process.exit(0);
  });
  // Do not hang forever if a connection refuses to drain.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
