import "server-only";
import { cookies } from "next/headers";
import { env } from "@cleanship/backend/env";
import {
  SHARE_MAX_AGE_SECONDS,
  shareCookieName,
  shareCookieValue,
} from "@cleanship/backend/cleantrack/share";

/**
 * Cookie half of the customer share gate. The naming and signing live in the
 * backend package; only `next/headers` is here.
 */

export async function grantShareAccess(shareToken: string) {
  const store = await cookies();
  store.set(shareCookieName(shareToken), shareCookieValue(shareToken), {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SHARE_MAX_AGE_SECONDS,
  });
}

export async function hasShareAccess(shareToken: string) {
  const store = await cookies();
  return (
    store.get(shareCookieName(shareToken))?.value === shareCookieValue(shareToken)
  );
}
