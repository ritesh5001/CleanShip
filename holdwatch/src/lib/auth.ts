import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

/**
 * Sessions.
 *
 * `jose` rather than `jsonwebtoken` because this runs inside Next.js, where
 * the same helper may be evaluated in the Edge runtime (middleware) as well as
 * Node. `jsonwebtoken` depends on Node crypto and breaks there.
 */

export const SESSION_COOKIE = "hw_session";
const BCRYPT_ROUNDS = 12;
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const secret = new TextEncoder().encode(env.SESSION_SECRET);

export type Role = "admin" | "supervisor" | "client";

export type Session = {
  sub: number;
  email: string;
  name: string;
  role: Role;
  /** Present for role "client" — scopes every query to their own company. */
  clientId: number | null;
};

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(session: Session) {
  /* `sub` is a registered JWT claim and must be a string, so the numeric user
     id is carried as `uid` and `sub` gets its string form. Reading it back in
     getSession reverses this. */
  const token = await new SignJWT({
    uid: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
    clientId: session.clientId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.sub))
    .setIssuedAt()
    .setIssuer("holdwatch")
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    /* Same-origin app, so "lax" is correct and safer than "none". */
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** The current session, or null. Never throws — callers decide what to do. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { issuer: "holdwatch" });
    return {
      sub: Number(payload.uid ?? payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as Role,
      clientId: (payload.clientId as number | null) ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Requires a session, optionally of specific roles.
 *
 * Redirects rather than throwing, because every caller is a page or a server
 * action and every one of them wants the same behaviour: send them to login.
 * A caller that needs a 401 instead should use `getSession` directly.
 */
export async function requireSession(...roles: Role[]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (roles.length && !roles.includes(session.role)) redirect(landingFor(session.role));
  return session;
}

/** Where a role belongs after login. One definition, used by every redirect. */
export function landingFor(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "supervisor") return "/app";
  return "/client";
}
