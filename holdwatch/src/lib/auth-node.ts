import bcrypt from "bcryptjs";

/**
 * Password hashing without the `server-only` guard.
 *
 * lib/auth.ts imports `server-only` and `next/headers`, neither of which can
 * be evaluated by a plain `tsx` script — so the seed cannot import it. The
 * cost is one duplicated constant; the alternative is a seed script that
 * cannot run.
 */
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
