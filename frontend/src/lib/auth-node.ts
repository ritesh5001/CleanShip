import bcrypt from "bcryptjs";

/**
 * Password hashing without the `server-only` guard.
 *
 * lib/auth.ts imports `server-only` and `next/headers`, neither of which a
 * plain `tsx` script can evaluate — so the bootstrap script cannot import it.
 * One duplicated constant is cheaper than a bootstrap script that cannot run.
 */
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
