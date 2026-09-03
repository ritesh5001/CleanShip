/**
 * Loads backend/.env for local runs.
 *
 * Import this FIRST — before anything that reads `process.env` — because ES
 * module imports evaluate in source order and `env.ts` validates at first use.
 *
 * On Render there is no .env file at all: variables come from the service's
 * environment, and dotenv finding nothing is the expected case, not an error.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/* src/ in dev (tsx), dist/ once compiled — the package root is one up either way. */
const packageRoot = resolve(here, "..");

const candidates = [
  resolve(packageRoot, ".env.local"),
  resolve(packageRoot, ".env"),
  resolve(packageRoot, "../.env.local"),
  resolve(packageRoot, "../.env"),
].filter((p) => existsSync(p));

if (candidates.length) {
  /* dotenv is a devDependency: it must never be required in production, where
     the platform supplies the environment. A dynamic import keeps the
     production bundle from depending on it at all. */
  const { config } = await import("dotenv");
  /* dotenv keeps the FIRST value it sees for a key, so listing .env.local
     first is what makes it win over .env. */
  for (const path of candidates) config({ path, quiet: true });
}
