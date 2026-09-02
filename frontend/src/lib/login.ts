import "server-only";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  createSession,
  verifyPassword,
  type Role,
} from "@/lib/auth";

export type LoginState = { error?: string };

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginResult =
  | { ok: true; role: Role }
  | { ok: false; error: string };

/**
 * Shared sign-in, used by both doors.
 *
 * There are two login pages — `/admin/login` for the office and
 * `/cleantrack/login` for crews — but one credential check behind them. Two
 * copies of this would be two places for an authentication bug to live.
 *
 * `allow` is which roles that door accepts. Someone at the wrong one gets told
 * which door is theirs rather than "wrong password", because that is what is
 * actually true and the alternative sends them to reset a working password.
 */
export async function attemptLogin(
  formData: FormData,
  allow: Role[],
): Promise<LoginResult> {
  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  let user;
  try {
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);
  } catch (err) {
    /* Almost always a missing DATABASE_URL or an unreachable database. Without
       this the exception escapes the server action and Next renders a bare
       "server-side exception" page with a digest — which tells the person at
       the keyboard nothing and the person debugging it almost nothing. */
    console.error("[login] database unavailable", err);
    return {
      ok: false,
      error:
        "Sign-in is temporarily unavailable — the service cannot reach its database. This is a configuration problem, not your password.",
    };
  }

  /* One message for "no such user" and "wrong password" alike: telling them
     apart tells an attacker which addresses are real. */
  const credentialsOk =
    user &&
    user.active === 1 &&
    (await verifyPassword(parsed.data.password, user.passwordHash));

  if (!user || !credentialsOk) {
    return { ok: false, error: "Those details do not match an active account." };
  }

  if (!allow.includes(user.role)) {
    return {
      ok: false,
      error:
        user.role === "supervisor"
          ? "That is a supervisor account. Sign in at the CleanTrack crew login instead."
          : "That is an office account. Sign in at the admin login instead.",
    };
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { ok: true, role: user.role };
}
