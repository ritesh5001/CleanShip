import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

/**
 * One session for the whole system.
 *
 * Previously the Express API minted a `cleanship_session` cookie for the CMS
 * and the job tracker minted its own. Two cookies, two secrets, two
 * user tables, two passwords per person. This is the single replacement.
 *
 * The cookie is scoped to COOKIE_DOMAIN (".cleanship.co" in production) so one
 * sign-in works on the marketing admin AND the CleanTrack subdomain. Locally
 * it is left unset, where host-only on localhost is correct.
 *
 * `jose` rather than `jsonwebtoken` because this may be evaluated in the Edge
 * runtime (middleware), where Node's crypto is unavailable.
 */

export const SESSION_COOKIE = "cleanship_session";
const BCRYPT_ROUNDS = 12;
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const secret = new TextEncoder().encode(env.SESSION_SECRET);

export type Role = "admin" | "editor" | "supervisor" | "client";

export type Session = {
  sub: number;
  email: string;
  name: string;
  role: Role;
  /** Present for role "client" — scopes CleanTrack queries to their company. */
  clientId: number | null;
};

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(session: Session) {
  /* `sub` is a registered claim and must be a string, so the numeric id is
     carried as `uid` and `sub` gets its string form. getSession reverses it. */
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
    .setIssuer("cleanship")
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    /* Same site now that everything is one origin family — no cross-origin
       API, so this never needs to be "none". */
    sameSite: "lax",
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    maxAge: 0,
  });
}

/** The current session, or null. Never throws — callers decide. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { issuer: "cleanship" });
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
 * Requires a session, optionally of specific roles. Redirects rather than
 * throwing, because every caller is a page or a server action and all of them
 * want the same behaviour.
 */
export async function requireSession(...roles: Role[]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/cleantrack/login");
  if (roles.length && !roles.includes(session.role)) {
    redirect(landingFor(session.role));
  }
  return session;
}

/** Where a role belongs after signing in. One definition, every redirect. */
export function landingFor(role: Role) {
  if (role === "supervisor") return "/cleantrack/app";
  if (role === "client") return "/cleantrack/client";
  if (role === "editor") return "/admin";
  return "/cleantrack/admin";
}
