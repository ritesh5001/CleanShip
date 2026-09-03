import bcrypt from "bcryptjs";

/**
 * bcrypt at cost 12.
 *
 * Cost is a deliberate trade: 12 is ~250ms on the small Render instance this
 * runs on, which is slow enough to make offline cracking expensive and fast
 * enough that a supervisor signing in on a phone does not think it hung.
 */
const COST = 12;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, COST);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/**
 * A readable one-time password for a new account.
 *
 * Given out loud over a radio or a phone, so no characters that sound alike
 * and no case ambiguity — the point is that it is typed correctly the first
 * time and then changed.
 */
export function temporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(10);
  globalThis.crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `${body.slice(0, 5)}-${body.slice(5)}`;
}
