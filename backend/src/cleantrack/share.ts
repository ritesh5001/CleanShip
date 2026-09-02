import crypto from "node:crypto";
import { env } from "../env";

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
 * An IMO number is public information — anyone can look one up from a vessel
 * name. This is a speed bump, not a lock. It stops a link forwarded to the
 * wrong inbox from opening straight into a job. It does NOT stop someone who
 * knows which vessel the link is for.
 *
 * The real controls are on the admin job page: sharing can be turned off, and
 * the token rotated, which breaks every copy of the old link. If a job is
 * genuinely sensitive, do not share a link for it.
 *
 * Cookie reading and writing lives in the app; this file only names and signs.
 */

export const SHARE_MAX_AGE_SECONDS = 12 * 60 * 60;

/**
 * Cookie name for one job's unlock.
 *
 * Keyed by a digest of the share token rather than the token itself: cookie
 * names turn up in screenshots and devtools more often than values do, and a
 * share token in a cookie name is a share token on someone's screen.
 */
export function shareCookieName(shareToken: string) {
  const digest = crypto
    .createHash("sha256")
    .update(shareToken)
    .digest("hex")
    .slice(0, 16);
  return `ct_view_${digest}`;
}

/** Signed so the cookie cannot simply be invented in devtools. */
export function shareCookieValue(shareToken: string) {
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
