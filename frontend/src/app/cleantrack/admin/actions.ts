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
  destination: z.string().max(160).optional(),
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
      destination: d.destination?.trim() || null,
      type: d.type,
      clientId: d.clientId ?? null,
      supervisorId: d.supervisorId ?? null,
      compartmentCount: d.compartmentCount,
      compartmentLabels,
      stages,
      /* Checkboxes post one entry each, so `getAll` — `Object.fromEntries`
         above keeps only the last one ticked. */
      crewIds: formData
        .getAll("crewIds")
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0),
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

const editVesselSchema = vesselSchema
  .pick({ name: true, imo: true, port: true, berth: true, destination: true, clientId: true, notes: true, scheduledFor: true })
  .extend({ vesselId: z.coerce.number().int().positive() });

/**
 * Edits a vessel's details and, when they changed, its holds or tanks.
 *
 * The compartment list only arrives when the admin actually changed it, so a
 * plain rename never touches the grid.
 */
export async function updateVesselAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");

  const parsed = editVesselSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const d = parsed.data;

  let labels: string[] | undefined;
  const rawLabels = formData.get("compartmentLabels");
  if (rawLabels) {
    try {
      labels = z
        .array(z.string().trim().min(1, "Every hold or tank needs a name.").max(40))
        .min(1)
        .max(60)
        .parse(JSON.parse(String(rawLabels)));
    } catch (err) {
      return {
        error:
          err instanceof z.ZodError
            ? firstIssue(err)
            : "The hold names could not be read. Reload and try again.",
      };
    }
  }

  try {
    await api.updateVessel(d.vesselId, {
      name: d.name.trim(),
      imo: d.imo?.trim() || null,
      port: d.port.trim(),
      berth: d.berth?.trim() || null,
      destination: d.destination?.trim() || null,
      clientId: d.clientId ?? null,
      scheduledFor: d.scheduledFor || null,
      notes: d.notes?.trim() || null,
    });
    if (labels) await api.setVesselCompartments(d.vesselId, labels);
  } catch (err) {
    return { error: messageFrom(err, "The vessel could not be saved.") };
  }

  revalidatePath("/cleantrack/admin");
  revalidatePath(`/cleantrack/admin/vessels/${d.vesselId}`);
  redirect(`/cleantrack/admin/vessels/${d.vesselId}`);
}

/** Superadmin only — checked here and again by the API. */
export async function deleteVesselAction(formData: FormData) {
  await requireSession("superadmin");
  const vesselId = Number(formData.get("vesselId"));
  await api.deleteVessel(vesselId);
  revalidatePath("/cleantrack/admin");
  redirect("/cleantrack/admin");
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
  password: z.string().min(6, "Password must be at least 6 characters."),
  /* No "client": customers have no account. They watch a vessel through the
     share link and its IMO number. */
  role: z.enum(["superadmin", "admin", "supervisor", "crew"]),
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

/* -------------------------------------------------------------------- */
/* Crew mobilisation                                                    */
/*                                                                      */
/* The joining sheet, from the office. An admin builds the roster and    */
/* can correct anybody's row — the same paperwork the joiner fills in on */
/* their phone and the supervisor works through at the hotel.            */
/* -------------------------------------------------------------------- */

export async function assignCrewAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  /* A multi-select posts one entry per choice, so this reads them all rather
     than `get`, which would silently take only the first. */
  const userIds = formData
    .getAll("userId")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);

  if (!Number.isInteger(vesselId) || userIds.length === 0) {
    return { error: "Choose at least one person." };
  }

  try {
    await api.assignCrew(vesselId, userIds);
  } catch (err) {
    return { error: messageFrom(err, "Could not add them to the crew.") };
  }
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
  return { ok: `Added ${userIds.length} to the crew.` };
}

export async function removeCrewAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  const userId = Number(formData.get("userId"));
  if (!Number.isInteger(vesselId) || !Number.isInteger(userId)) return;

  try {
    await api.removeCrew(vesselId, userId);
  } catch (err) {
    /* A failed removal leaves the person on the board, which is visible on the
       next render — there is no silent half-state to explain. */
    console.error("[removeCrew]", err);
  }
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
}

/**
 * One square on the board.
 *
 * Posted as a tiny form per cell rather than one big save, because the office
 * corrects one thing at a time — "his medical came through" — and a whole-form
 * save would overwrite whatever the crew ticked on their phones since the page
 * was opened.
 */
export async function setCrewCellAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  const userId = Number(formData.get("userId"));
  const kind = String(formData.get("kind"));
  const key = String(formData.get("key"));
  const value = String(formData.get("value"));
  if (!Number.isInteger(vesselId) || !Number.isInteger(userId) || !key) return;

  try {
    if (kind === "document") {
      await api.patchCrewMember(vesselId, userId, {
        documents: { [key]: value as never },
      });
    } else if (kind === "checklist") {
      await api.patchCrewMember(vesselId, userId, {
        checklist: { [key]: value === "true" },
      });
    } else if (kind === "travel") {
      await api.patchCrewMember(vesselId, userId, {
        travel: { [key]: value === "" ? null : new Date().toISOString() },
      });
    }
  } catch (err) {
    console.error("[setCrewCell]", err);
  }
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
}

/** What this vessel asks its joiners for. Editable until the crew are aboard. */
export async function setCrewListsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  const parse = (raw: FormDataEntryValue | null) =>
    String(raw ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((label) => ({ label }));

  const documents = parse(formData.get("documents"));
  const checklist = parse(formData.get("checklist"));
  if (documents.length === 0 && checklist.length === 0) {
    return { error: "A vessel needs at least one row on its joining sheet." };
  }

  try {
    await api.setCrewLists(vesselId, { documents, checklist });
  } catch (err) {
    return { error: messageFrom(err, "Could not save the joining lists.") };
  }
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
  return { ok: "Joining sheet saved." };
}

/**
 * The switch, and its undo.
 *
 * The office can call it as well as the supervisor — a gang that reported over
 * the phone still has to be recorded — and only the office can take it back,
 * which is what makes "reported" safe to treat as final everywhere else.
 */
export async function holdReportedAction(formData: FormData) {
  await requireSession("admin");
  const vesselId = Number(formData.get("vesselId"));
  const reopen = String(formData.get("reopen")) === "1";
  if (!Number.isInteger(vesselId)) return;

  try {
    if (reopen) await api.reopenMobilisation(vesselId);
    else await api.reportToHold(vesselId);
  } catch (err) {
    console.error("[holdReported]", err);
  }
  revalidatePath(`/cleantrack/admin/vessels/${vesselId}`);
}
