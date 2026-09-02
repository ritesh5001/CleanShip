"use server";

import { redirect } from "next/navigation";
import { landingFor } from "@/lib/session";
import { attemptLogin, type LoginState } from "@/lib/login";

export type { LoginState };

/** The crew door. Supervisors only — office accounts are told where to go. */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = await attemptLogin(formData, ["supervisor"]);
  if (!result.ok) return { error: result.error };
  redirect(landingFor(result.role));
}
