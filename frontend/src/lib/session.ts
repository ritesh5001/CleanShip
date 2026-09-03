import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "./session-cookie";

/**
 * The signed-in user, as this app sees it.
 *
 * The token is issued by the CleanTrack API and verified HERE, locally, with
 * the shared SESSION_SECRET. That is the whole reason the secret is shared:
 * rendering a page would otherwise mean a network round trip to the API just
 * to learn who is asking, on every navigation.
 *
 * Verifying locally decides only what this app SHOWS. Every piece of data
 * comes from the API, which authorises the token again on its own terms — so a
 * forged or stale cookie gets an empty shell and a 401, never someone's data.
 *
 * ⚠️ SESSION_SECRET must be byte-identical on Vercel and on Render.
 */

export type Role = "admin" | "editor" | "supervisor";

export type Session = {
  sub: number;
  email: string;
  name: string;
  role: Role;
};

const ROLES: Role[] = ["admin", "editor", "supervisor"];

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error(
      "SESSION_SECRET is not set. It must match the value on the CleanTrack API — see backend/.env.example.",
    );
  }
  return new TextEncoder().encode(value);
}

/** Where a role lands after signing in. Mirrors the API's own mapping. */
export function landingFor(role: Role) {
  if (role === "supervisor") return "/cleantrack/app";
  if (role === "editor") return "/admin";
  return "/cleantrack/admin";
}

export async function createSession(token: string, maxAge: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    /* Every navigation that needs it is same-site, so "lax" is right and
       "none" would only widen the CSRF surface for nothing. */
    sameSite: "lax",
    path: "/",
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    maxAge,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    maxAge: 0,
  });
}

/** The current session, or null. Never throws — callers decide what to do. */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), {
      issuer: "cleanship",
      audience: "cleanship-app",
    });
    const sub = Number(payload.sub);
    const role = payload.role as Role;
    if (!Number.isInteger(sub) || !ROLES.includes(role)) return null;
    return {
      sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role,
    };
  } catch {
    return null;
  }
}

/**
 * Requires a session, optionally of specific roles.
 *
 * Redirects rather than throwing: every caller is a page or a server action
 * and all of them want the same behaviour.
 */
export async function requireSession(...roles: Role[]): Promise<Session> {
  const session = await getSession();

  /* Sent to the door that matches what they were reaching for. A supervisor
     bounced to the office login, or an admin to the crew login, is a support
     call — the two entrances exist precisely so neither happens. */
  if (!session) {
    redirect(roles.includes("supervisor") ? "/cleantrack/login" : "/admin/login");
  }
  if (roles.length && !roles.includes(session.role)) {
    redirect(landingFor(session.role));
  }
  return session;
}
