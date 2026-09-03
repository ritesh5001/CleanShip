import { SignJWT, jwtVerify } from "jose";
import { env } from "../env.js";
import { isRole, type SessionUser } from "./roles.js";

/**
 * Session tokens.
 *
 * HS256 with a shared secret, deliberately: the Next app on Vercel verifies
 * these locally so it can render the right shell without asking this service
 * on every page render. That means SESSION_SECRET must be identical on both
 * deployments — it is the one piece of configuration the two share.
 *
 * The token is the whole session. There is no server-side session table, so
 * signing out clears the cookie and a stolen token stays valid until it
 * expires; that is the trade for not doing a database round trip per request.
 * Deactivating a user is checked on every API call, which is the lever that
 * actually revokes access.
 */

/** Name of the cookie the Next app stores this in. */
export const SESSION_COOKIE = "cleanship_session";

const ISSUER = "cleanship";
const AUDIENCE = "cleanship-app";

function secret() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export function sessionMaxAgeSeconds() {
  return env.SESSION_TTL_HOURS * 3600;
}

export async function signSession(user: SessionUser) {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.sub))
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${env.SESSION_TTL_HOURS}h`)
    .sign(secret());
}

/** Returns null for anything that is not a currently valid session. */
export async function verifySession(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const sub = Number(payload.sub);
    if (!Number.isInteger(sub) || !isRole(payload.role)) return null;
    return {
      sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: payload.role,
    };
  } catch {
    return null;
  }
}
