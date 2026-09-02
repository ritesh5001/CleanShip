"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession, landingFor, verifyPassword } from "@/lib/auth";

export type LoginState = { error?: string };

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  /* One message for "no such user" and "wrong password" alike. Distinguishing
     them tells an attacker which addresses are real. */
  const ok =
    user &&
    user.active === 1 &&
    (await verifyPassword(parsed.data.password, user.passwordHash));

  if (!ok || !user) {
    return { error: "Those details do not match an active account." };
  }

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    clientId: user.clientId ?? null,
  });

  redirect(landingFor(user.role));
}
