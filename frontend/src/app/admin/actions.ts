"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, landingFor, requireSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { enquiries, users } from "@/lib/db/schema";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

/**
 * The single sign-in for the whole system — enquiry inbox and CleanTrack
 * alike. Previously the CMS authenticated against an Express API on another
 * origin and CleanTrack had its own login; one users table means one door.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  /* One message for "no such user" and "wrong password" alike — telling them
     apart tells an attacker which addresses are real. */
  const ok =
    user &&
    user.active === 1 &&
    (await verifyPassword(parsed.data.password, user.passwordHash));

  if (!ok || !user) {
    return { error: "Those details do not match an active account." };
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    clientId: user.clientId ?? null,
  });

  redirect(landingFor(user.role));
}

const STATUSES = ["new", "in-progress", "quoted", "won", "lost", "spam"] as const;

export async function setEnquiryStatusAction(formData: FormData) {
  await requireSession("admin", "editor");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;

  await db
    .update(enquiries)
    .set({ status: status as (typeof STATUSES)[number] })
    .where(eq(enquiries.id, id));
  revalidatePath("/admin");
}
