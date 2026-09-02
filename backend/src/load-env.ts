/**
 * Loads .env files for scripts run outside Next.
 *
 * Import this FIRST, before anything that reads `process.env`. ES module
 * imports are evaluated in source order, so a side-effect import at the top is
 * the only reliable way to populate the environment before ./env.ts validates
 * it — `config()` inline in a script runs too late, because the imports above
 * it have already been evaluated.
 *
 * THE ENV FILE LIVES IN frontend/, NOT HERE.
 *
 * Next only reads `.env.local` from its own directory, and it is the thing
 * that actually runs in production. Rather than keep two copies in step — the
 * classic way to spend an afternoon debugging a script pointed at the wrong
 * database — the scripts in this package reach across to the app's file.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");

for (const candidate of [
  resolve(repoRoot, "frontend/.env.local"),
  resolve(repoRoot, "frontend/.env"),
  resolve(repoRoot, ".env.local"),
  resolve(repoRoot, ".env"),
]) {
  if (existsSync(candidate)) config({ path: candidate, quiet: true });
}
