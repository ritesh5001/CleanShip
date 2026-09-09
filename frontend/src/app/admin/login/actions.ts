"use server";

import { redirect } from "next/navigation";
import { landingFor } from "@/lib/session";
import { attemptLogin, type LoginState } from "@/lib/login";

export type { LoginState };

/** The office door. Office staff only — admin and above. */
export async function adminLogin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = await attemptLogin(formData, ["admin", "superadmin"]);
  if (!result.ok) return { error: result.error };
  redirect(landingFor(result.role));
}
