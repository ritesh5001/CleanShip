/**
 * Loads .env files for scripts run outside Next.
 *
 * Import this FIRST, before anything that reads `process.env`. ES module
 * imports are evaluated in source order, so a side-effect import at the top is
 * the only reliable way to populate the environment before ./env.ts validates
 * it — `config()` inline in a script runs too late, because the imports above
 * it have already been evaluated.
 *
 * THE ENV FILE LIVES HERE: backend/.env
 *
 * It is the single source of truth for the whole system. The Next app reads
 * the same file — frontend/next.config.ts loads it explicitly, because Next
 * only reads .env files from its own directory and configuration belongs
 * beside the code that owns it.
 *
 * The frontend paths below are kept purely as a fallback for anyone with an
 * older checkout that still has frontend/.env.local. backend/.env wins,
 * because dotenv does not overwrite a variable that is already set.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");

for (const candidate of [
  // Canonical, first — dotenv keeps the first value it sees for a given key.
  resolve(repoRoot, "backend/.env.local"),
  resolve(repoRoot, "backend/.env"),
  // Legacy fallbacks, for older checkouts.
  resolve(repoRoot, "frontend/.env.local"),
  resolve(repoRoot, "frontend/.env"),
  resolve(repoRoot, ".env.local"),
  resolve(repoRoot, ".env"),
]) {
  if (existsSync(candidate)) config({ path: candidate, quiet: true });
}
