import { z } from "zod";

/**
 * Server environment, validated lazily on first access.
 *
 * Lazy rather than at import, so `--help`-style entry points, the migration
 * runner and the test suite can import modules from this package without a
 * full production environment. The server itself calls `assertEnv()` during
 * boot, which is where a missing variable should be loud.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required — see .env.example"),

  /**
   * Shared with the Next app. The backend signs session tokens with it and the
   * frontend verifies them locally so it can render the right shell without a
   * round trip. Change it in one place and sign-ins break in the other, which
   * is why both deployments must carry the same value.
   */
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),

  /** How long a sign-in lasts. Crews work long shifts; a day is deliberate. */
  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(24),

  /**
   * Origins allowed to call this API from a browser.
   *
   * Comma separated. Server-to-server calls from the Next app are not subject
   * to CORS at all — this exists for direct browser calls (the live-progress
   * poll) and for local development.
   */
  CORS_ORIGINS: z.string().default("http://localhost:3000"),

  /** Where the customer share links point. Used to build the link text. */
  CLEANTRACK_URL: z.string().url().default("http://localhost:3000/cleantrack"),

  /** Seed credentials for the first admin. Only read by `npm run seed`. */
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional(),
  SEED_ADMIN_NAME: z.string().optional(),
});

type Env = z.infer<typeof schema> & {
  isProduction: boolean;
  corsOrigins: string[];
};

let cached: Env | null = null;

function resolveEnv(): Env {
  if (cached) return cached;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration:\n${issues}\n\n` +
        "Set these on the Render service (Environment → Environment Variables) " +
        "or in backend/.env for local development. See backend/.env.example.",
    );
  }

  cached = {
    ...parsed.data,
    isProduction: parsed.data.NODE_ENV === "production",
    corsOrigins: parsed.data.CORS_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  };
  return cached;
}

/** Reads like a plain object; validates on first property access. */
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return resolveEnv()[prop as keyof Env];
  },
});

/** Call during boot so misconfiguration fails immediately and by name. */
export function assertEnv() {
  resolveEnv();
}
