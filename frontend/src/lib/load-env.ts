/**
 * Loads .env files for scripts run outside Next.
 *
 * Import this FIRST, before anything that reads `process.env`. ES module
 * imports are evaluated in source order, so a side-effect import at the top is
 * the only reliable way to populate the environment before `lib/env.ts`
 * validates it — putting `config()` inline in the script runs too late,
 * because the imports it sits below have already been evaluated.
 *
 * Next loads .env.local itself, so this is only for `tsx` scripts.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config();
