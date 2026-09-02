import { z } from "zod";

/**
 * Server environment, validated on first import.
 *
 * Only the database and session variables are required. The marketing site
 * itself is statically prerendered and needs none of them at build time, so a
 * missing DATABASE_URL breaks the admin and CleanTrack and leaves the public
 * site working — which is the right failure shape for a marketing site.
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
   * production so one sign-in works on both the site and the CleanTrack
   * subdomain — that is the whole point of the merge. Leave unset locally,
   * where everything is on localhost anyway.
   */
  COOKIE_DOMAIN: z.string().optional(),
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
