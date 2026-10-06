import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const CAPTCHA_ERROR =
  "Please complete the security check and try again.";

/**
 * Checks the Cloudflare Turnstile token a form posted.
 *
 * Every public form's server action calls this before doing anything else.
 * The widget alone proves nothing — anything can POST a server action — so
 * the token has to be confirmed with Cloudflare from here.
 *
 * With TURNSTILE_SECRET_KEY unset the check is skipped (and the widget is not
 * rendered, since its site key is unset too). That keeps local development
 * and a deploy that predates the keys working, rather than locking the office
 * out of its own login over a missing variable. Production should always
 * have both set.
 */
export async function verifyTurnstile(formData: FormData): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set — check skipped");
    }
    return true;
  }

  const token = formData.get("cf-turnstile-response");
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.warn("[turnstile] rejected", data["error-codes"]);
    }
    return data.success;
  } catch (err) {
    console.error("[turnstile] verification unavailable", err);
    return false;
  }
}
