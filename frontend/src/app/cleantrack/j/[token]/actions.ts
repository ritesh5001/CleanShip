"use server";

import { redirect } from "next/navigation";
import { getJobByShareToken } from "@/lib/cleantrack/jobs";
import { grantShareAccess, imoMatches } from "@/lib/share-access";

export type GateState = { error?: string };

export async function unlockShare(
  _prev: GateState,
  formData: FormData,
): Promise<GateState> {
  const token = String(formData.get("token") ?? "");
  const imo = String(formData.get("imo") ?? "");

  let job;
  try {
    job = await getJobByShareToken(token);
  } catch (err) {
    console.error("[share] database unavailable", err);
    return {
      error:
        "This page is temporarily unavailable. Please try again shortly, or contact the operations desk.",
    };
  }

  /* Same message whether the link is dead or the IMO is wrong. Distinguishing
     them confirms to someone holding a stray link that the job is real. */
  if (!job || !imoMatches(imo, job.imo)) {
    return {
      error:
        "That does not match. Check the IMO number on the vessel's particulars and try again.",
    };
  }

  await grantShareAccess(token);
  redirect(`/cleantrack/j/${token}`);
}
