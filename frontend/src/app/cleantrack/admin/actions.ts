"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/lib/session";
import { ApiError } from "@/lib/api";
import * as api from "@/lib/api";

export type FormState = { error?: string; ok?: string };

/**
 * Server actions are the only place this app writes.
 *
 * Each one authenticates locally (so an unauthenticated request never leaves
 * the building), then calls the API, which authorises again on its own terms.
 * The API is the authority; this layer exists to turn a form post into a call
 * and an error into a sentence someone can act on.
 */
function messageFrom(err: unknown, fallback: string) {
  if (err instanceof ApiError) return err.message;
  console.error("[action]", err);
  return fallback;
}

/**
 * Names the field in a validation message.
 *
 * Zod's own message is the second half of a sentence — "Too small: expected
 * number to be >0" — which tells someone staring at a twenty-field form
 * nothing about which box to look at.
 */
function firstIssue(error: z.ZodError) {
  const issue = error.issues[0];
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}

/**
 * An unselected `<select>` posts an empty string, and `z.coerce.number()`
 * turns that into 0 — which then fails `.positive()` with a message about
 * numbers when the user simply left an optional field alone. Blank has to
 * become "absent" before coercion, not after.
 */
const optionalId = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.coerce.number().int().positive().optional(),
);

/* -------------------------------------------------------------------- */
/* Vessels                                                              */
/* -------------------------------------------------------------------- */

const stageSchema = z.object({
  key: z.string().optional(),
  label: z.string().min(1),
  short: z.string().optional(),
});

const vesselSchema = z.object({
  name: z.string().min(2, "Enter the vessel name.").max(160),
  imo: z
    .string()
    .trim()
    .regex(/^\d{7}$/, "IMO is 7 digits.")
    .optional()
    .or(z.literal("")),
  port: z.string().min(2, "Enter the port.").max(160),
  berth: z.string().max(120).optional(),
  type: z.enum(["hold", "tank"]),
  clientId: optionalId,
  supervisorId: optionalId,
  /* The upper bound guards against a typo turning into hundreds of rows and a
     page that will not render — not a claim about the largest ship afloat. */
  compartmentCount: z.coerce
    .number()
    .int()
    .min(1, "At least one compartment.")
    .max(60, "More than 60 — check the number."),
  scheduledFor: z.string().optional(),
  notes: z.string().max(2000).optional(),
  /** JSON, because a variable-length list does not fit flat form fields. */
  stages: z.string(),
  compartmentLabels: z.string().optional(),
});

export async function createVesselAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");

  const parsed = vesselSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const d = parsed.data;

  let stages: { key?: string; label: string; short?: string }[];
  let compartmentLabels: string[] | undefined;
  try {
    stages = z.array(stageSchema).min(1).parse(JSON.parse(d.stages));
    compartmentLabels = d.compartmentLabels
      ? z.array(z.string()).parse(JSON.parse(d.compartmentLabels))
      : undefined;
  } catch {
    return { error: "The stage list could not be read. Reload and try again." };
  }

  let id: number;
  try {
    const vessel = await api.createVessel({
      name: d.name,
      imo: d.imo || null,
      port: d.port,
      berth: d.berth || null,
      type: d.type,
      clientId: d.clientId ?? null,
      supervisorId: d.supervisorId ?? null,
      compartmentCount: d.compartmentCount,
      compartmentLabels,
      stages,
      scheduledFor: d.scheduledFor || null,
      notes: d.notes || null,
    });
    id = vessel.id;
  } catch (err) {
    return { error: messageFrom(err, "The vessel could not be created.") };
  }

  revalidatePath("/cleantrack/admin");
  redirect(`/cleantrack/admin/vessels/${id}`);
}

export async function assignSupervisorAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  const raw = String(formData.get("supervisorId") ?? "");
  await api.assignSupervisor(vesselId, raw ? Number(raw) : null);
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
  revalidatePath("/cleantrack/admin");
}

export async function setVesselStatusAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  const status = String(formData.get("status"));
  await api.updateVessel(vesselId, { status });
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
}

/**
 * Rotates the share token, which immediately breaks every copy of the old
 * link. That is the point of the feature: a link forwarded to the wrong person
 * is a vessel visible to the wrong person, and the only fix is a new token.
 */
export async function rotateShareLinkAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  await api.rotateShareLink(vesselId);
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
}

export async function toggleShareAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  await api.setShareRevoked(vesselId, String(formData.get("revoke")) === "1");
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
}

/** Edits the stage list of an existing vessel. */
export async function setStagesAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  try {
    const stages = z
      .array(stageSchema)
      .min(1)
      .parse(JSON.parse(String(formData.get("stages") ?? "[]")));
    await api.setVesselStages(vesselId, stages);
  } catch (err) {
    return { error: messageFrom(err, "The stages could not be saved.") };
  }
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
  return { ok: "Stages updated." };
}

/* -------------------------------------------------------------------- */
/* Clients                                                              */
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
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  try {
    await api.createClient({
      name: parsed.data.name,
      contactName: parsed.data.contactName || null,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
    });
  } catch (err) {
    return { error: messageFrom(err, "The client could not be added.") };
  }

  revalidatePath("/cleantrack/admin/clients");
  return { ok: `${parsed.data.name} added.` };
}

/* -------------------------------------------------------------------- */
/* People                                                               */
/* -------------------------------------------------------------------- */

const userSchema = z.object({
  name: z.string().min(2, "Enter a name.").max(120),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(10, "Password must be at least 10 characters."),
  /* No "client": customers have no account. They watch a vessel through the
     share link and its IMO number. */
  role: z.enum(["admin", "editor", "supervisor"]),
  phone: z.string().max(40).optional(),
});

export async function createUserAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");
  const parsed = userSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  try {
    await api.createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
      phone: parsed.data.phone || null,
    });
  } catch (err) {
    return { error: messageFrom(err, "The account could not be created.") };
  }

  revalidatePath("/cleantrack/admin/users");
  return { ok: `${parsed.data.name} can now sign in.` };
}

export async function toggleUserActiveAction(formData: FormData) {
  const session = await requireSession("admin");
  const userId = Number(formData.get("userId"));
  /* Locking yourself out of the only admin account is a support call nobody
     wants at 02:00 with a vessel alongside. The API refuses this too. */
  if (userId === session.sub) return;
  await api.updateUser(userId, {
    active: String(formData.get("active")) === "1",
  });
  revalidatePath("/cleantrack/admin/users");
}
