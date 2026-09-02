import { z } from "zod";

/**
 * Server environment, validated LAZILY.
 *
 * This used to parse and throw at module scope, which broke the Vercel build:
 * Next evaluates every route module during "Collecting page data", so a single
 * missing variable took down the whole deployment — including 884 marketing
 * pages that are statically prerendered and never touch a database.
 *
 * The failure shape now matches what each part of the site actually needs:
 *
 *   · The marketing site builds and serves with NO environment at all.
 *   · CleanTrack and the enquiry inbox fail at REQUEST time, loudly and with
 *     a message naming the missing variable, because those genuinely cannot
 *     work without a database.
 *
 * A broken admin page is a bad afternoon. A build that will not deploy because
 * the admin page is misconfigured is a broken website.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required — see .env.example"),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
  /** Absolute origin of the marketing site. */
  APP_URL: z.string().url().default("http://localhost:3000"),
  /**
   * Origin CleanTrack is served from. Client share links are built from it, so
   * a wrong value sends every link you issue to the wrong host.
   */
  CLEANTRACK_URL: z.string().url().default("http://localhost:3000/cleantrack"),
  /**
   * Domain the session cookie is scoped to. Set to ".cleanship.co" in
   * production so one sign-in works on the site and the CleanTrack subdomain
   * alike. Leave unset locally, where everything is on localhost.
   */
  COOKIE_DOMAIN: z.string().optional(),
});

type Env = z.infer<typeof schema> & { isProduction: boolean };

let cached: Env | null = null;

function resolve(): Env {
  if (cached) return cached;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration:\n${issues}\n\n` +
        "Set these in your deployment environment (Vercel → Settings → " +
        "Environment Variables) or in .env.local for local development.",
    );
  }

  cached = { ...parsed.data, isProduction: parsed.data.NODE_ENV === "production" };
  return cached;
}

/**
 * Reads like a plain object; validates on first property access.
 *
 * The Proxy exists so ~20 call sites can keep writing `env.DATABASE_URL`
 * rather than `getEnv().DATABASE_URL`, while nothing is validated until
 * something actually asks for a value — which is what makes the build safe.
 */
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return resolve()[prop as keyof Env];
  },
});

/** True when the database is configured. Lets a page degrade instead of 500. */
export function isConfigured(): boolean {
  try {
    resolve();
    return true;
  } catch {
    return false;
  }
}
