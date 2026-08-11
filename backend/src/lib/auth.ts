import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../env.js";
import { ApiError } from "./http.js";

export const SESSION_COOKIE = "cleanship_session";

/** Cost 12 — comfortably above the practical brute-force threshold in 2026. */
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export type SessionPayload = {
  sub: number;
  email: string;
  role: "admin" | "editor";
};

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
    issuer: "cleanship-api",
  });
}

export function verifySession(token: string): SessionPayload {
  try {
    // jwt.verify is typed as string | JwtPayload; the shape is guaranteed by
    // signSession, which is the only thing that mints these tokens.
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: "cleanship-api",
    }) as unknown as SessionPayload;
  } catch {
    throw ApiError.unauthorized("Session expired or invalid");
  }
}

/**
 * Session cookie options.
 *
 * httpOnly so a XSS cannot read the token; sameSite:"none" + secure in
 * production because the API and the site are on different origins, and a
 * cross-site cookie must be Secure to be accepted at all.
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionPayload;
    }
  }
}

/** Rejects the request unless a valid session cookie is present. */
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return next(ApiError.unauthorized());
  try {
    req.user = verifySession(token);
    next();
  } catch (err) {
    next(err);
  }
}

/** Must run after requireAuth. */
export function requireRole(...roles: SessionPayload["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("Your role cannot perform this action"));
    }
    next();
  };
}

/**
 * One-way hash of a client IP, for abuse triage without storing the address
 * itself. Salted with JWT_SECRET so the digests are not reversible via a
 * precomputed table of the IPv4 space.
 */
export function hashIp(ip: string | undefined) {
  if (!ip) return null;
  return crypto
    .createHash("sha256")
    .update(`${ip}:${env.JWT_SECRET}`)
    .digest("hex")
    .slice(0, 64);
}
