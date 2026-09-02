import "server-only";
import { checkCredentials } from "@cleanship/backend/users";
import type { Role } from "@cleanship/backend/auth/roles";
import { createSession } from "./session";

export type LoginState = { error?: string };

export type LoginResult =
  | { ok: true; role: Role }
  | { ok: false; error: string };

/**
 * Shared sign-in, used by both doors.
 *
 * There are two login pages — `/admin/login` for the office and
 * `/cleantrack/login` for crews — but one credential check behind them. Two
 * copies would be two places for an authentication bug to live.
 *
 * The check itself is in the backend package; this turns its result into a
 * message and sets the cookie.
 */
export async function attemptLogin(
  formData: FormData,
  allow: Role[],
): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!password) return { ok: false, error: "Enter your password." };

  const result = await checkCredentials(email, password, allow);

  if (!result.ok) {
    if (result.reason === "unavailable") {
      return {
        ok: false,
        error:
          "Sign-in is temporarily unavailable — the service cannot reach its database. This is a configuration problem, not your password.",
      };
    }
    if (result.reason === "wrong-door") {
      return {
        ok: false,
        error:
          result.role === "supervisor"
            ? "That is a supervisor account. Sign in at the CleanTrack crew login instead."
            : "That is an office account. Sign in at the admin login instead.",
      };
    }
    return { ok: false, error: "Those details do not match an active account." };
  }

  await createSession(result.session);
  return { ok: true, role: result.session.role };
}
