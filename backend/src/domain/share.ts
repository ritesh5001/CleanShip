import crypto from "node:crypto";
import { env } from "../env.js";

/**
 * The customer gate.
 *
 * A share link alone is a bearer credential that can be forwarded, screenshot
 * or pasted into a chat. Asking for the vessel's IMO number on top of it is a
 * second factor that a customer already knows and a stranger holding a
 * forwarded link almost certainly does not — without issuing anyone an
 * account, which is the whole point.
 */

/** IMO numbers get typed with spaces, dashes and an "IMO" prefix. */
export function normaliseImo(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function imoMatches(vesselImo: string | null, supplied: string) {
  if (!vesselImo) return false;
  const a = normaliseImo(vesselImo);
  const b = normaliseImo(supplied);
  if (!a || !b) return false;
  /* Fixed-time compare: the gate is cheap to hammer, and a length-dependent
     early exit is a free hint about how close a guess was. */
  const bufA = Buffer.from(a.padEnd(16, "\0"));
  const bufB = Buffer.from(b.padEnd(16, "\0"));
  return a.length === b.length && crypto.timingSafeEqual(bufA, bufB);
}

/** The link handed to a customer. */
export function shareUrl(token: string) {
  return `${env.CLEANTRACK_URL.replace(/\/$/, "")}/j/${token}`;
}

/**
 * Cookie name and value for a passed gate.
 *
 * Keyed by the token so a customer holding links to two vessels does not have
 * one gate let them through the other. The value is an HMAC of the token, so
 * the cookie cannot be forged without the server secret.
 */
export const SHARE_MAX_AGE_SECONDS = 60 * 60 * 12;

export function shareCookieName(token: string) {
  return `ct_share_${token.slice(0, 12)}`;
}

export function shareCookieValue(token: string) {
  return crypto
    .createHmac("sha256", env.SESSION_SECRET)
    .update(`share:${token}`)
    .digest("base64url");
}
