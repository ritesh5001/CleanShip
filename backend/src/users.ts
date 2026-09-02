import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./db/schema";
import { verifyPassword } from "./auth/passwords";
import type { Role, Session } from "./auth/roles";

/**
 * User lookup and credential checking.
 *
 * `checkCredentials` returns a discriminated result rather than throwing or
 * setting a cookie: creating the session is the app's job, because that means
 * touching `next/headers`. This file stays framework-free.
 */

export type CredentialResult =
  | { ok: true; session: Session }
  | { ok: false; reason: "unavailable" | "invalid" | "wrong-door"; role?: Role };

export async function checkCredentials(
  email: string,
  password: string,
  allow: Role[],
): Promise<CredentialResult> {
  let user;
  try {
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);
  } catch (err) {
    /* Almost always a missing DATABASE_URL or an unreachable database. The
       caller turns this into a message saying so, rather than letting the
       exception escape and render a bare 500 with a digest. */
    console.error("[auth] database unavailable", err);
    return { ok: false, reason: "unavailable" };
  }

  /* One outcome for "no such user" and "wrong password" alike: telling them
     apart tells an attacker which addresses are real. */
  const credentialsOk =
    user &&
    user.active === 1 &&
    (await verifyPassword(password, user.passwordHash));

  if (!user || !credentialsOk) return { ok: false, reason: "invalid" };

  /* A correct password at the wrong door is not a failed login. Saying
     "incorrect password" here sends someone to reset a password that works. */
  if (!allow.includes(user.role)) {
    return { ok: false, reason: "wrong-door", role: user.role };
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  return {
    ok: true,
    session: {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
