import "./src/load-env.js";
import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit is here for `db:generate` and `db:studio` during development.
 *
 * Deployments do NOT use it: `npm run migrate` applies the hand-written SQL in
 * migrations/ instead. Keeping generation and application separate means what
 * runs against production is a file someone read.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations/generated",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
