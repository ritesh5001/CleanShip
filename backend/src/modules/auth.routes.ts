import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { env } from "../env.js";
import {
  SESSION_COOKIE,
  hashPassword,
  requireAuth,
  requireRole,
  sessionCookieOptions,
  signSession,
  verifyPassword,
} from "../lib/auth.js";
import { ApiError, asyncHandler, parseBody } from "../lib/http.js";

export const authRouter = Router();

/** Login is the prime target for credential stuffing, so it is throttled hard. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many attempts. Try again later." },
});

const credentials = z.object({
  email: z.email().max(160),
  password: z.string().min(1).max(200),
});

const newUser = z.object({
  email: z.email().max(160),
  // 12 chars with no composition rules — length beats character classes.
  password: z.string().min(12, "Use at least 12 characters").max(200),
  name: z.string().min(2).max(120),
  role: z.enum(["admin", "editor"]).default("editor"),
});

/**
 * POST /api/auth/bootstrap
 *
 * Creates the very first admin. Guarded twice: it requires the
 * ADMIN_BOOTSTRAP_TOKEN, and it refuses outright once any user exists — so
 * leaving the route mounted cannot become a backdoor.
 */
authRouter.post(
  "/bootstrap",
  loginLimiter,
  asyncHandler(async (req, res) => {
    if (!env.ADMIN_BOOTSTRAP_TOKEN) {
      throw ApiError.forbidden("Bootstrap is disabled");
    }

    const supplied = req.get("x-bootstrap-token");
    if (supplied !== env.ADMIN_BOOTSTRAP_TOKEN) {
      throw ApiError.unauthorized("Invalid bootstrap token");
    }

    const [tally] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    if ((tally?.count ?? 0) > 0) {
      throw ApiError.conflict(
        "An account already exists — bootstrap can only create the first user",
      );
    }

    const input = parseBody(newUser, { ...req.body, role: "admin" });
    const [created] = await db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        name: input.name,
        role: "admin",
      })
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

    res.status(201).json({ user: created });
  }),
);

/** POST /api/auth/login */
authRouter.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const input = parseBody(credentials, req.body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email.toLowerCase()))
      .limit(1);

    // Same response whether the email is unknown or the password is wrong —
    // a distinct "no such user" turns this endpoint into an account oracle.
    // The dummy hash keeps timing comparable when the user does not exist.
    const hash =
      user?.passwordHash ??
      "$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012";
    const ok = await verifyPassword(input.password, hash);

    if (!user || !ok) {
      throw ApiError.unauthorized("Incorrect email or password");
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const token = signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie(SESSION_COOKIE, token, sessionCookieOptions()).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  }),
);

/** POST /api/auth/logout */
authRouter.post("/logout", (req, res) => {
  res
    .clearCookie(SESSION_COOKIE, { ...sessionCookieOptions(), maxAge: undefined })
    .json({ ok: true });
});

/** GET /api/auth/me — used by the admin UI to restore a session. */
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.id, req.user!.sub))
      .limit(1);

    // The token can outlive the account it names.
    if (!user) throw ApiError.unauthorized("Account no longer exists");

    res.json({ user });
  }),
);

/** POST /api/auth/users — admins invite further staff. */
authRouter.post(
  "/users",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const input = parseBody(newUser, req.body);

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email.toLowerCase()))
      .limit(1);

    if (existing) throw ApiError.conflict("That email already has an account");

    const [created] = await db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        name: input.name,
        role: input.role,
      })
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

    res.status(201).json({ user: created });
  }),
);
