import "dotenv/config";
import { z } from "zod";

/**
 * Environment is validated once, at boot.
 *
 * Failing here — loudly, before the server binds a port — is far better than
 * discovering a missing JWT_SECRET on the first login attempt in production.
 */
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required — see .env.example"),

  // 32 chars is the practical floor for an HS256 signing key.
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  CORS_ORIGINS: z.string().default("http://localhost:3000"),

  ADMIN_BOOTSTRAP_TOKEN: z.string().min(16).optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  console.error(`\nInvalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

const raw = parsed.data;

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === "production",
  /** Parsed allow-list; credentialed CORS cannot use a wildcard. */
  corsOrigins: raw.CORS_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
