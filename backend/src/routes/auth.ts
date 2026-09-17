import { Router } from "express";
import { z } from "zod";
import { checkCredentials } from "../domain/users.js";
import { signSession, sessionMaxAgeSeconds } from "../auth/tokens.js";
import { isRole, loginPageFor, landingFor, type Role } from "../auth/roles.js";
import { parseBody } from "../http/validate.js";
import { ApiError } from "../http/errors.js";
import { requireRole, sessionOf } from "../http/session.js";

export const authRoutes = Router();

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  /**
   * Which door they knocked on. The office login sends ["admin","superadmin"];
   * the Android app sends ["supervisor","crew"]; the website's crew login
   * sends ["supervisor"], because crew have no web screens. Omitted means any
   * role.
   */
  allow: z.array(z.string()).optional(),
});

/**
 * What to tell someone whose account exists but who knocked on the wrong door.
 *
 * This used to be a two-way split — supervisor, or "office account" for
 * everything else — written when those were the only kinds of account. When
 * `crew` arrived it fell into the office branch, so a joiner signing in on an
 * out-of-date app was told to go and use the admin login: the one place that
 * can never let them in. Every role now gets a sentence that points somewhere
 * it can actually sign in.
 *
 * For crew the only doors that refuse them are an app built before crew
 * accounts existed and the website, so the message names both fixes rather
 * than guessing which one this is.
 */
function wrongDoorMessage(role: Role) {
  if (role === "crew") {
    return "That is a crew account. Crew sign in on the CleanTrack Android app — if you are already in the app, install the latest version and try again.";
  }
  if (role === "supervisor") {
    return "That is a supervisor account. Sign in at the CleanTrack crew login instead.";
  }
  return "That is an office account. Sign in at the admin login instead.";
}

/**
 * POST /api/v1/auth/login
 *
 * Returns a signed token; storing it is the caller's problem. The Next app
 * puts it in an httpOnly cookie and forwards it on server-side calls, which
 * is why nothing here sets a cookie itself — this API is called from two
 * different origins and only one of them can hold a first-party cookie.
 */
authRoutes.post("/login", async (req, res) => {
  const body = parseBody(loginSchema, req.body);
  const allow = (body.allow ?? []).filter(isRole) as Role[];

  const result = await checkCredentials(body.email, body.password, allow);

  if (!result.ok) {
    if (result.reason === "wrong-door" && result.role) {
      throw new ApiError(
        403,
        "wrong_door",
        wrongDoorMessage(result.role),
        { loginPage: loginPageFor(result.role) },
      );
    }
    throw ApiError.unauthorized("Those details do not match an active account.");
  }

  const token = await signSession(result.session);
  res.json({
    token,
    expiresIn: sessionMaxAgeSeconds(),
    user: result.session,
    landing: landingFor(result.session.role),
  });
});

/** Who the bearer token belongs to. Also the frontend's liveness check. */
authRoutes.get("/me", requireRole(), (req, res) => {
  const session = sessionOf(req);
  res.json({ user: session, landing: landingFor(session.role) });
});
