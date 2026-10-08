import "server-only";
import { ApiError, login as apiLogin } from "./api";
import { canVerifyToken, createSession, type Role } from "./session";
import { CAPTCHA_ERROR, verifyTurnstile } from "./turnstile";

export type LoginState = { error?: string };

export type LoginResult =
  | { ok: true; role: Role; landing: string }
  | { ok: false; error: string };

/**
 * Shared sign-in, used by both doors.
 *
 * There are two login pages — `/admin/login` for the office and
 * `/cleantrack/login` for crews — but one credential check behind them, in the
 * API. Two copies would be two places for an authentication bug to live.
 *
 * `allow` is passed through so the API can tell someone they are at the wrong
 * entrance rather than that their password is wrong.
 */
export async function attemptLogin(
  formData: FormData,
  allow: Role[],
): Promise<LoginResult> {
  /* Before the credentials go anywhere: a bot guessing passwords never
     reaches the API. */
  if (!(await verifyTurnstile(formData))) {
    return { ok: false, error: CAPTCHA_ERROR };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!password) return { ok: false, error: "Enter your password." };

  try {
    const result = await apiLogin(email, password, allow);
    /* Setting a cookie this app then rejects would send the user into the
       admin and straight back out, which has surfaced as a 502 rather than
       anything readable. Stop here and say what is wrong instead. */
    if (!(await canVerifyToken(result.token))) {
      console.error(
        "[login] The API's session token does not verify here: SESSION_SECRET differs between this app and the API.",
      );
      return {
        ok: false,
        error: "Sign-in is misconfigured on the server (session keys do not match). Please contact the site administrator.",
      };
    }
    await createSession(result.token, result.expiresIn);
    return { ok: true, role: result.user.role, landing: result.landing };
  } catch (err) {
    if (err instanceof ApiError) {
      /* The API already writes these for a person to read — "that is a
         supervisor account, sign in at the crew login" and so on. Rewriting
         them here would put the same sentence in two repositories. */
      return { ok: false, error: err.message };
    }
    return {
      ok: false,
      error: "Sign-in is temporarily unavailable. Try again in a moment.",
    };
  }
}
