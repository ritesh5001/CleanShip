import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

/**
 * The customer's way in: a share link plus the vessel's IMO number.
 *
 * Customers have no account by design — nothing to issue, nothing to reset,
 * nobody chasing the office for a password at 02:00 because a vessel sailed.
 * The link alone is a bearer credential, so the IMO is asked for as a second
 * factor.
 *
 * ⚠️ BE CLEAR ABOUT WHAT THIS IS AND IS NOT.
 *
 * An IMO number is public information — anyone can look one up from the vessel
 * name. This is a speed bump, not a lock. It stops a link forwarded to the
 * wrong inbox from opening straight into a job, and it means a link pasted
 * somewhere careless is not immediately readable. It does NOT protect against
 * someone who knows which vessel the link is for.
 *
 * The real controls are the ones on the admin job page: sharing can be turned
 * off, and the token can be rotated, which breaks every copy of the old link.
 * If a job is genuinely sensitive, do not share a link for it.
 */

const COOKIE_PREFIX = "ct_view_";
const MAX_AGE_SECONDS = 12 * 60 * 60;

/**
 * Cookie name for one job's unlock.
 *
 * Keyed by a digest of the token rather than the token itself: cookie names
 * appear in more places than cookie values do, and a share token in a cookie
 * name is a share token in a screenshot.
 */
function cookieName(shareToken: string) {
  const digest = crypto
    .createHash("sha256")
    .update(shareToken)
    .digest("hex")
    .slice(0, 16);
  return `${COOKIE_PREFIX}${digest}`;
}

/** Signed so the cookie cannot simply be invented in devtools. */
function sign(shareToken: string) {
  return crypto
    .createHmac("sha256", env.SESSION_SECRET)
    .update(`share:${shareToken}`)
    .digest("hex")
    .slice(0, 32);
}

/** IMO numbers are 7 digits; comparison ignores spacing and an "IMO" prefix. */
export function normaliseImo(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function imoMatches(supplied: string, actual: string | null) {
  if (!actual) return false;
  const a = normaliseImo(supplied);
  const b = normaliseImo(actual);
  return a.length > 0 && a === b;
}

export async function grantShareAccess(shareToken: string) {
  const store = await cookies();
  store.set(cookieName(shareToken), sign(shareToken), {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function hasShareAccess(shareToken: string) {
  const store = await cookies();
  return store.get(cookieName(shareToken))?.value === sign(shareToken);
}
