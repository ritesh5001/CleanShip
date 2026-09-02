"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, jobs, users } from "@/lib/db/schema";
import { createJob, newShareToken } from "@/lib/jobs";

export type FormState = { error?: string; ok?: string };

/* -------------------------------------------------------------------- */
/* Jobs                                                                  */
/* -------------------------------------------------------------------- */

const jobSchema = z.object({
  vesselName: z.string().min(2, "Enter the vessel name.").max(160),
  imo: z
    .string()
    .trim()
    .regex(/^\d{7}$/, "IMO is 7 digits.")
    .optional()
    .or(z.literal("")),
  port: z.string().min(2, "Enter the port.").max(160),
  berth: z.string().max(120).optional(),
  jobType: z.enum(["hold-cleaning", "tank-cleaning"]),
  clientId: z.coerce.number().int().positive("Choose a client."),
  supervisorId: z.coerce.number().int().optional(),
  /* Upper bound is a guard against a typo turning into 500 rows and a page
     that will not render, not a claim about the largest ship afloat. */
  compartmentCount: z.coerce
    .number()
    .int()
    .min(1, "At least one compartment.")
    .max(30, "More than 30 — check the number."),
  scheduledFor: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export async function createJobAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");

  const parsed = jobSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const job = await createJob({
    vesselName: d.vesselName,
    imo: d.imo || null,
    port: d.port,
    berth: d.berth || null,
    jobType: d.jobType,
    clientId: d.clientId,
    supervisorId: d.supervisorId || null,
    compartmentCount: d.compartmentCount,
    scheduledFor: d.scheduledFor ? new Date(d.scheduledFor) : null,
    notes: d.notes || null,
  });

  revalidatePath("/admin");
  redirect(`/admin/jobs/${job.id}`);
}

export async function assignSupervisorAction(formData: FormData) {
  await requireSession("admin");
  const jobId = Number(formData.get("jobId"));
  const raw = String(formData.get("supervisorId") ?? "");
  const supervisorId = raw ? Number(raw) : null;

  await db.update(jobs).set({ supervisorId, updatedAt: new Date() }).where(eq(jobs.id, jobId));
  revalidatePath(`/admin/jobs/${jobId}`);
}

export async function setJobStatusAction(formData: FormData) {
  await requireSession("admin");
  const jobId = Number(formData.get("jobId"));
  const status = String(formData.get("status")) as
    | "scheduled"
    | "in-progress"
    | "complete"
    | "cancelled";

  await db.update(jobs).set({ status, updatedAt: new Date() }).where(eq(jobs.id, jobId));
  revalidatePath(`/admin/jobs/${jobId}`);
}

/**
 * Rotates the share token, which immediately breaks every copy of the old
 * link. The point of the feature: a link forwarded to the wrong person is a
 * job visible to the wrong person, and the only fix is a new token.
 */
export async function rotateShareLinkAction(formData: FormData) {
  await requireSession("admin");
  const jobId = Number(formData.get("jobId"));
  await db
    .update(jobs)
    .set({ shareToken: newShareToken(), shareRevoked: 0, updatedAt: new Date() })
    .where(eq(jobs.id, jobId));
  revalidatePath(`/admin/jobs/${jobId}`);
}

export async function toggleShareAction(formData: FormData) {
  await requireSession("admin");
  const jobId = Number(formData.get("jobId"));
  const revoke = String(formData.get("revoke")) === "1";
  await db
    .update(jobs)
    .set({ shareRevoked: revoke ? 1 : 0, updatedAt: new Date() })
    .where(eq(jobs.id, jobId));
  revalidatePath(`/admin/jobs/${jobId}`);
}

/* -------------------------------------------------------------------- */
/* Clients                                                               */
/* -------------------------------------------------------------------- */

const clientSchema = z.object({
  name: z.string().min(2, "Enter the company name.").max(160),
  contactName: z.string().max(120).optional(),
  contactEmail: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  contactPhone: z.string().max(40).optional(),
});

export async function createClientAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(clients).values({
    name: parsed.data.name,
    contactName: parsed.data.contactName || null,
    contactEmail: parsed.data.contactEmail || null,
    contactPhone: parsed.data.contactPhone || null,
  });

  revalidatePath("/admin/clients");
  return { ok: `${parsed.data.name} added.` };
}

/* -------------------------------------------------------------------- */
/* People                                                                */
/* -------------------------------------------------------------------- */

const userSchema = z
  .object({
    name: z.string().min(2, "Enter a name.").max(120),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(10, "Password must be at least 10 characters."),
    role: z.enum(["admin", "supervisor", "client"]),
    clientId: z.string().optional(),
    phone: z.string().max(40).optional(),
  })
  .refine((v) => v.role !== "client" || Boolean(v.clientId), {
    message: "A client login must be tied to a company.",
    path: ["clientId"],
  });

export async function createUserAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");
  const parsed = userSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const email = parsed.data.email.trim().toLowerCase();
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) return { error: "That email already has an account." };

  await db.insert(users).values({
    name: parsed.data.name,
    email,
    passwordHash: await hashPassword(parsed.data.password),
    role: parsed.data.role,
    clientId: parsed.data.clientId ? Number(parsed.data.clientId) : null,
    phone: parsed.data.phone || null,
  });

  revalidatePath("/admin/users");
  return { ok: `${parsed.data.name} can now sign in.` };
}

export async function toggleUserActiveAction(formData: FormData) {
  const session = await requireSession("admin");
  const userId = Number(formData.get("userId"));
  /* Locking yourself out of the only admin account is a support call nobody
     wants at 02:00 when a job is running. */
  if (userId === session.sub) return;
  const active = String(formData.get("active")) === "1" ? 1 : 0;
  await db.update(users).set({ active }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}
