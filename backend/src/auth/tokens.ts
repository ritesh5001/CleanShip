import { SignJWT, jwtVerify } from "jose";
import { env } from "../env";
import type { Session } from "./roles";

/**
 * Session tokens.
 *
 * Signing and verification only — reading and writing the cookie is framework
 * plumbing and lives in the app (frontend/src/lib/session.ts). That split is
 * what keeps this package free of Next imports.
 *
 * `jose` rather than `jsonwebtoken` because the app may verify a token in the
 * Edge runtime, where Node's crypto is unavailable.
 */

export const SESSION_COOKIE = "cleanship_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/* Resolved on first use. Reading env at module scope made a missing
   SESSION_SECRET fail the whole build rather than only the pages needing a
   session — see the note in ../env.ts. */
let cachedSecret: Uint8Array | null = null;
function secretKey() {
  if (!cachedSecret) cachedSecret = new TextEncoder().encode(env.SESSION_SECRET);
  return cachedSecret;
}

export async function signSession(session: Session): Promise<string> {
  /* `sub` is a registered claim and must be a string, so the numeric id is
     carried as `uid` and `sub` gets its string form. verifySession reverses it. */
  return new SignJWT({
    uid: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.sub))
    .setIssuedAt()
    .setIssuer("cleanship")
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Returns null rather than throwing — every caller wants the same fallback. */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: "cleanship",
    });
    return {
      sub: Number(payload.uid ?? payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as Session["role"],
    };
  } catch {
    return null;
  }
}
