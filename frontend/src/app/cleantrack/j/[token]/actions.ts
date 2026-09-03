"use server";

import { redirect } from "next/navigation";
import { ApiError, verifyShare } from "@/lib/api";
import { grantShareAccess } from "@/lib/share-session";

export type GateState = { error?: string };

/**
 * The IMO gate.
 *
 * The comparison happens in the API, in constant time, against a vessel this
 * app never loads unless the answer is right — so a wrong guess learns
 * nothing, not even whether the link is live.
 */
export async function unlockShare(
  _prev: GateState,
  formData: FormData,
): Promise<GateState> {
  const token = String(formData.get("token") ?? "");
  const imo = String(formData.get("imo") ?? "");

  try {
    const { proof } = await verifyShare(token, imo);
    await grantShareAccess(token, proof);
  } catch (err) {
    if (err instanceof ApiError && err.status >= 500) {
      return {
        error:
          "This page is temporarily unavailable. Please try again shortly, or contact the operations desk.",
      };
    }
    /* Same message whether the link is dead or the IMO is wrong. Telling them
       apart confirms to someone holding a stray link that the vessel is real. */
    return {
      error:
        "That does not match. Check the IMO number on the vessel's particulars and try again.",
    };
  }

  redirect(`/cleantrack/j/${token}`);
}
