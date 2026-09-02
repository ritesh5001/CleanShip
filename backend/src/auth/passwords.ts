import bcrypt from "bcryptjs";

/** Cost 12 — comfortably above the practical brute-force threshold. */
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
