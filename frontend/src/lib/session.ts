import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@cleanship/backend/env";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySession,
} from "@cleanship/backend/auth/tokens";
import { landingFor, type Role, type Session } from "@cleanship/backend/auth/roles";

/**
 * Cookie plumbing for sessions.
 *
 * The signing lives in the backend package; this is the half that needs
 * `next/headers` and `next/navigation`. Splitting them is what lets the
 * backend stay free of framework imports — see backend/README.md.
 *
 * The cookie is scoped to COOKIE_DOMAIN (".cleanship.co" in production) so one
 * sign-in works on the marketing admin AND the CleanTrack subdomain. Locally
 * it is left unset, where host-only on localhost is correct.
 */

export type { Role, Session };
export { landingFor };

export async function createSession(session: Session) {
  const token = await signSession(session);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    /* Same origin family now that there is no cross-origin API, so this never
       needs to be "none". */
    sameSite: "lax",
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    maxAge: SESSION_MAX_AGE_SECONDS,
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

/** The current session, or null. Never throws — callers decide what to do. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
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
