import crypto from "node:crypto";

/** Duplicated from lib/jobs.ts, which is `server-only` and so unusable from
    a plain tsx seed script. Keep the two in step. */
export function newShareToken() {
  return crypto.randomBytes(24).toString("base64url");
}
