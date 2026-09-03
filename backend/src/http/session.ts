import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { verifySession } from "../auth/tokens.js";
import { SESSION_COOKIE } from "../auth/tokens.js";
import type { Role, SessionUser } from "../auth/roles.js";
import { ApiError } from "./errors.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session?: SessionUser;
    }
  }
}

/**
 * Finds the bearer token.
 *
 * `Authorization: Bearer …` is the path the Next app uses — it holds the token
 * in an httpOnly cookie of its own and forwards it server-side. The cookie
 * fallback exists for a browser calling this API directly on the same site,
 * and for poking at it with curl during setup.
 */
function tokenFrom(req: Request): string | null {
  const header = req.header("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();

  const raw = req.header("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/**
 * Attaches `req.session` when a valid token is present. Never rejects — the
 * routes that need a session say so with `requireRole`.
 */
export async function attachSession(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = tokenFrom(req);
  if (token) {
    const session = await verifySession(token);
    if (session) req.session = session;
  }
  next();
}

/**
 * Gate for a route.
 *
 * The deactivation check hits the database on every guarded request. That is a
 * deliberate cost: tokens are self-contained and last a day, so without it,
 * removing someone's access would not take effect until their token expired —
 * which is not what "deactivate" means to the person clicking it.
 */
export function requireRole(...roles: Role[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const session = req.session;
    if (!session) return next(ApiError.unauthorized());

    const [row] = await db
      .select({ active: users.active, role: users.role, name: users.name })
      .from(users)
      .where(eq(users.id, session.sub))
      .limit(1);

    if (!row || !row.active) {
      return next(ApiError.unauthorized("This account is no longer active."));
    }

    /* The token carries a snapshot of the role; the database is the truth.
       A demoted admin must lose admin the moment it is saved, not tomorrow. */
    session.role = row.role;
    session.name = row.name;

    if (roles.length && !roles.includes(session.role)) {
      return next(ApiError.forbidden());
    }
    next();
  };
}

/** For routes that have already passed `requireRole`. */
export function sessionOf(req: Request): SessionUser {
  if (!req.session) throw ApiError.unauthorized();
  return req.session;
}
