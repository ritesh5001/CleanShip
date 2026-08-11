import { migrate } from "drizzle-orm/node-postgres/migrator";
import { closeDb, db } from "./index.js";

/**
 * Applies any pending SQL migrations from ./drizzle.
 * Run after `npm run db:generate`, and as a release step on deploy.
 */
async function main() {
  console.log("[db] applying migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[db] migrations up to date");
}

main()
  .catch((err) => {
    console.error("[db] migration failed", err);
    process.exitCode = 1;
  })
  .finally(closeDb);
