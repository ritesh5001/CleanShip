import { z } from "zod";

/**
 * Environment, validated once on first import.
 *
 * Failing loudly at boot beats discovering a missing SESSION_SECRET on a
 * supervisor's first login attempt at a dock with no signal to debug it.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required — see .env.example"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
  /** Absolute origin, used to build share links that work in an email. */
  APP_URL: z.string().url().default("http://localhost:3200"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
};
