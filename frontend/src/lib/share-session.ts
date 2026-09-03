import "server-only";
import { cookies } from "next/headers";

/**
 * Remembers that a customer passed the IMO gate.
 *
 * The API hands back a `proof` string when the IMO matches; it is an HMAC of
 * the share token, so this cookie cannot be forged and is worthless on any
 * other vessel's link. Keeping it here rather than in localStorage means the
 * server can render the page already unlocked on a return visit.
 */

const MAX_AGE_SECONDS = 60 * 60 * 12;

function cookieName(shareToken: string) {
  return `ct_share_${shareToken.slice(0, 12)}`;
}

export async function grantShareAccess(shareToken: string, proof: string) {
  const store = await cookies();
  store.set(cookieName(shareToken), proof, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** The stored proof for this link, or null if the gate has not been passed. */
export async function shareProof(shareToken: string) {
  const store = await cookies();
  return store.get(cookieName(shareToken))?.value ?? null;
}
