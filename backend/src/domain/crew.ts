import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  crewAssignments,
  users,
  vessels,
  type CrewAssignment,
  type Vessel,
} from "../db/schema.js";
import { ApiError } from "../http/errors.js";
import type { SessionUser } from "../auth/roles.js";

/**
 * Crew mobilisation: everything between "you are on this job" and "I am
 * standing on the deck".
 *
 * This is the printed joining sheet — a column per person, a row per item —
 * turned into something the joiner fills in themselves. Three kinds of item
 * live on it and they behave differently, which is why they are three maps
 * rather than one:
 *
 *   DOCUMENTS   three-state. A passport is held, missing, or expired, and
 *               "expired" is not a worse kind of missing — it is the case
 *               where somebody has a document, believes they are covered, and
 *               is not. It has to be visible as its own colour.
 *   CHECKLIST   two-state. Either the rope kit photo arrived or it did not.
 *   TRAVEL      a time. "Boarded the flight" is not a tick, it is 04:20, and
 *               the office chasing a late joiner needs the number.
 *
 * WHICH LISTS A VESSEL USES
 *
 * Documents and checklist are held on the vessel, copied from the templates
 * below at creation and editable per vessel — the same contract `stages` has.
 * A rope-access job needs IRATA and a hold-cleaning gang does not, and a
 * finished job must keep the list it was actually worked to. Nothing here is
 * read to decide what a vessel asks for: `vessel.crewDocuments` is the answer.
 *
 * Travel is the exception and is fixed in code. The chain from a hotel to an
 * aircraft door is the same on every job in every country, and making it
 * configurable would be six more fields on the create form that nobody would
 * ever change.
 */

/* -------------------------------------------------------------------- */
/* Item shapes                                                          */
/* -------------------------------------------------------------------- */

export type CrewDocumentItem = {
  /** Stored as a key in every assignment's map. Frozen once written. */
  key: string;
  label: string;
};

export type CrewChecklistItem = {
  key: string;
  label: string;
};

/**
 * Three states, matching the sheet.
 *
 * `pending` is the blank cell. It deliberately does NOT mean "no" — a joiner
 * who has not got to it yet and a joiner who has no passport look the same on
 * paper, and the fix for that is chasing them, not a fourth state nobody
 * would set honestly.
 */
export const DOCUMENT_STATES = ["pending", "done", "expired"] as const;
export type DocumentState = (typeof DOCUMENT_STATES)[number];

export type DocumentMap = Record<string, DocumentState>;
export type ChecklistMap = Record<string, boolean>;
/** ISO string per step, or null where it has been cleared. */
export type TravelMap = Record<string, string | null>;

export function isDocumentState(value: unknown): value is DocumentState {
  return (
    typeof value === "string" &&
    (DOCUMENT_STATES as readonly string[]).includes(value)
  );
}

/* -------------------------------------------------------------------- */
/* Templates — the starting point, not the law                          */
/* -------------------------------------------------------------------- */

/** The document rows on the printed sheet, in its order. */
export const DEFAULT_CREW_DOCUMENTS: CrewDocumentItem[] = [
  { key: "passport", label: "Passport" },
  { key: "indian_cdc", label: "Indian CDC" },
  { key: "irata", label: "IRATA" },
  { key: "bosiet_stcw", label: "BOSIET / STCW" },
  { key: "medical", label: "Medical" },
  { key: "yellow_fever", label: "Yellow Fever" },
  { key: "sid", label: "SID" },
  { key: "insurance", label: "Insurance" },
];

/** The checklist rows, likewise. */
export const DEFAULT_CREW_CHECKLIST: CrewChecklistItem[] = [
  { key: "cleanship_contract", label: "Cleanship contract" },
  { key: "nominee_details", label: "Nominee details" },
  { key: "e_migration", label: "e-Migration" },
  { key: "agent_contact", label: "Agent contact details given to joiner" },
  { key: "documents_valid", label: "All documents checked, none expired" },
  { key: "rope_kit", label: "Rope kit confirmed (photo seen)" },
  { key: "boiler_suit", label: "Boiler suit" },
  { key: "safety_shoe", label: "Safety shoe" },
  { key: "form_i", label: "Form I regulation explained" },
  { key: "roaming_pack", label: "One-day roaming pack activated" },
  { key: "sid_original", label: "Original SID card carried, verified by crew" },
  { key: "grooming", label: "Well groomed and professional" },
];

/**
 * The travel chain, in order, ending at the aircraft.
 *
 * Reporting to the hold is NOT here: that is one fact about the vessel, set
 * once for the whole gang, and it is what ends mobilisation. Putting it at the
 * end of a personal chain would let one joiner's tap start the ship.
 */
export type TravelStep = { key: string; label: string; short: string };

export const TRAVEL_STEPS: TravelStep[] = [
  { key: "departed_hotel", label: "Departed hotel", short: "Hotel" },
  { key: "reached_airport", label: "Reached airport", short: "Airport" },
  { key: "boarding_pass", label: "Boarding pass received", short: "Pass" },
  { key: "immigration", label: "Immigration cleared", short: "Immig." },
  { key: "boarded_flight", label: "Boarded the flight", short: "Boarded" },
  {
    key: "boiler_suit_change",
    label: "Boiler suit changed at airport",
    short: "Suit",
  },
];

const TRAVEL_KEYS = new Set(TRAVEL_STEPS.map((s) => s.key));

/**
 * Turns a free-typed row name into a storage key.
 *
 * Derived once, at creation, then frozen: renaming a row later changes its
 * label and leaves the key alone, so nobody's recorded answer is orphaned.
 * Same rule and same shape as `stageKeyFrom`.
 */
export function crewKeyFrom(label: string, taken: Set<string> = new Set()) {
  const base =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 36) || "item";
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}_${n}`.slice(0, 40);
    if (!taken.has(candidate)) return candidate;
  }
}

/** Cleans a submitted list, assigning keys and dropping blanks. */
export function normaliseCrewItems<T extends { key?: string; label: string }>(
  items: T[] | undefined,
  fallback: CrewDocumentItem[],
): CrewDocumentItem[] {
  if (!items) return fallback.map((i) => ({ ...i }));
  const taken = new Set<string>();
  const out: CrewDocumentItem[] = [];
  for (const item of items) {
    const label = item.label?.trim();
    if (!label) continue;
    const key =
      item.key?.trim() && !taken.has(item.key.trim())
        ? item.key.trim()
        : crewKeyFrom(label, taken);
    taken.add(key);
    out.push({ key, label: label.slice(0, 120) });
  }
  return out;
}

/* -------------------------------------------------------------------- */
/* Shapes the API returns                                               */
/* -------------------------------------------------------------------- */

export type CrewProgress = {
  /** Documents that are `done`, out of those the vessel asks for. */
  documentsDone: number;
  documentsTotal: number;
  /** Documents sitting at `expired` — the number that stops a flight. */
  documentsExpired: number;
  checklistDone: number;
  checklistTotal: number;
  travelDone: number;
  travelTotal: number;
  /** Everything asked for is answered and nothing is expired. */
  ready: boolean;
};

export type CrewMember = {
  id: number;
  vesselId: number;
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  /** True for the vessel's assigned supervisor — they join like anyone else. */
  isSupervisor: boolean;
  documents: DocumentMap;
  checklist: ChecklistMap;
  travel: TravelMap;
  notes: string | null;
  updatedByName: string | null;
  updatedAt: Date;
  progress: CrewProgress;
};

/**
 * How far one person has got.
 *
 * Counted against the VESSEL's lists, not against whatever keys happen to be
 * in the person's map: a row removed from the vessel's checklist after someone
 * ticked it must stop counting, or the job can read as more than complete.
 */
export function crewProgressOf(
  vessel: Pick<Vessel, "crewDocuments" | "crewChecklist">,
  row: Pick<CrewAssignment, "documents" | "checklist" | "travel">,
): CrewProgress {
  const documents = vessel.crewDocuments ?? [];
  const checklist = vessel.crewChecklist ?? [];

  let documentsDone = 0;
  let documentsExpired = 0;
  for (const item of documents) {
    const state = row.documents?.[item.key];
    if (state === "done") documentsDone += 1;
    else if (state === "expired") documentsExpired += 1;
  }

  const checklistDone = checklist.filter(
    (item) => row.checklist?.[item.key] === true,
  ).length;

  const travelDone = TRAVEL_STEPS.filter((step) => row.travel?.[step.key]).length;

  return {
    documentsDone,
    documentsTotal: documents.length,
    documentsExpired,
    checklistDone,
    checklistTotal: checklist.length,
    travelDone,
    travelTotal: TRAVEL_STEPS.length,
    /* Travel is not part of readiness. Somebody who has not left the hotel yet
       is not unready — they are on schedule. Readiness is the paperwork, which
       is the thing that stops them boarding at all. */
    ready:
      documentsExpired === 0 &&
      documentsDone === documents.length &&
      checklistDone === checklist.length,
  };
}

/* -------------------------------------------------------------------- */
/* Reads                                                                */
/* -------------------------------------------------------------------- */

function toMember(
  row: CrewAssignment,
  person: { name: string; email: string; phone: string | null; role: string },
  vessel: Pick<Vessel, "crewDocuments" | "crewChecklist" | "supervisorId">,
): CrewMember {
  return {
    id: row.id,
    vesselId: row.vesselId,
    userId: row.userId,
    name: person.name,
    email: person.email,
    phone: person.phone,
    role: person.role,
    isSupervisor: vessel.supervisorId === row.userId,
    documents: row.documents ?? {},
    checklist: row.checklist ?? {},
    travel: row.travel ?? {},
    notes: row.notes,
    updatedByName: row.updatedByName,
    updatedAt: row.updatedAt,
    progress: crewProgressOf(vessel, row),
  };
}

/** The roster for one vessel, in name order. */
export async function listCrew(vesselId: number): Promise<CrewMember[]> {
  const [vessel] = await db
    .select({
      crewDocuments: vessels.crewDocuments,
      crewChecklist: vessels.crewChecklist,
      supervisorId: vessels.supervisorId,
    })
    .from(vessels)
    .where(eq(vessels.id, vesselId))
    .limit(1);
  if (!vessel) throw ApiError.notFound("No such vessel.");

  const rows = await db
    .select({ assignment: crewAssignments, user: users })
    .from(crewAssignments)
    .innerJoin(users, eq(users.id, crewAssignments.userId))
    .where(eq(crewAssignments.vesselId, vesselId))
    .orderBy(asc(users.name));

  return rows.map((r) => toMember(r.assignment, r.user, vessel));
}

/**
 * What one person is joining — the crew app's home screen.
 *
 * Returns the vessel alongside each assignment because a joiner needs to know
 * which ship and which port before the paperwork means anything, and because
 * `holdReportedAt` on that vessel is what tells their app to stop asking.
 */
export type MyAssignment = {
  vessel: Pick<
    Vessel,
    | "id"
    | "reference"
    | "name"
    | "port"
    | "berth"
    | "destination"
    | "type"
    | "status"
    | "scheduledFor"
    | "holdReportedAt"
    | "crewDocuments"
    | "crewChecklist"
  >;
  member: CrewMember;
};

export async function listMyAssignments(userId: number): Promise<MyAssignment[]> {
  const rows = await db
    .select({ assignment: crewAssignments, vessel: vessels })
    .from(crewAssignments)
    .innerJoin(vessels, eq(vessels.id, crewAssignments.vesselId))
    .where(eq(crewAssignments.userId, userId));

  if (rows.length === 0) return [];

  const [person] = await db
    .select({
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!person) throw ApiError.notFound("No such user.");

  return rows
    .map(({ assignment, vessel }) => ({
      vessel: {
        id: vessel.id,
        reference: vessel.reference,
        name: vessel.name,
        port: vessel.port,
        berth: vessel.berth,
        destination: vessel.destination,
        type: vessel.type,
        status: vessel.status,
        scheduledFor: vessel.scheduledFor,
        holdReportedAt: vessel.holdReportedAt,
        crewDocuments: vessel.crewDocuments ?? [],
        crewChecklist: vessel.crewChecklist ?? [],
      },
      member: toMember(assignment, person, vessel),
    }))
    /* Still joining first, then most recently scheduled. A joiner with an old
       finished job and a live one must not have to hunt for the live one. */
    .sort((a, b) => {
      const aOpen = a.vessel.holdReportedAt ? 1 : 0;
      const bOpen = b.vessel.holdReportedAt ? 1 : 0;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return (
        (b.vessel.scheduledFor?.getTime() ?? 0) -
        (a.vessel.scheduledFor?.getTime() ?? 0)
      );
    });
}

/** One person's row, or null. Used by the access checks. */
export async function getAssignment(
  vesselId: number,
  userId: number,
): Promise<CrewAssignment | null> {
  const [row] = await db
    .select()
    .from(crewAssignments)
    .where(
      and(
        eq(crewAssignments.vesselId, vesselId),
        eq(crewAssignments.userId, userId),
      ),
    )
    .limit(1);
  return row ?? null;
}

/* -------------------------------------------------------------------- */
/* Writes                                                               */
/* -------------------------------------------------------------------- */

/**
 * Puts people on a vessel.
 *
 * Idempotent per person: somebody already on the roster is left exactly as
 * they are, paperwork included. Re-adding must never be a way to wipe a
 * joiner's answers, and an admin correcting a mis-typed roster should not have
 * to think about it.
 */
export async function assignCrew(
  vesselId: number,
  userIds: number[],
): Promise<CrewMember[]> {
  const wanted = [...new Set(userIds)];
  if (wanted.length === 0) return listCrew(vesselId);

  const [vessel] = await db
    .select({ id: vessels.id })
    .from(vessels)
    .where(eq(vessels.id, vesselId))
    .limit(1);
  if (!vessel) throw ApiError.notFound("No such vessel.");

  const found = await db
    .select({ id: users.id, active: users.active })
    .from(users)
    .where(inArray(users.id, wanted));

  const usable = found.filter((u) => u.active === 1).map((u) => u.id);
  if (usable.length !== wanted.length) {
    throw ApiError.badRequest(
      "One of those accounts does not exist or is disabled.",
    );
  }

  await db
    .insert(crewAssignments)
    .values(usable.map((userId) => ({ vesselId, userId })))
    .onConflictDoNothing({
      target: [crewAssignments.vesselId, crewAssignments.userId],
    });

  return listCrew(vesselId);
}

/**
 * Takes somebody off a vessel, and their paperwork with them.
 *
 * A hard delete rather than a flag: being on the roster by mistake is the
 * common case, and keeping a ghost column on the board for a person who was
 * never going is worse than losing the three ticks somebody put on it.
 */
export async function removeCrew(vesselId: number, userId: number) {
  const [row] = await db
    .delete(crewAssignments)
    .where(
      and(
        eq(crewAssignments.vesselId, vesselId),
        eq(crewAssignments.userId, userId),
      ),
    )
    .returning({ id: crewAssignments.id });
  if (!row) throw ApiError.notFound("That person is not on this vessel.");
}

export type CrewPatch = {
  documents?: DocumentMap;
  checklist?: ChecklistMap;
  /** ISO strings, or null to clear a step. */
  travel?: TravelMap;
  notes?: string | null;
};

/**
 * Updates one person's paperwork, merging rather than replacing.
 *
 * The merge is the whole point. A joiner filling in their nominee details on a
 * phone and a supervisor ticking their rope kit on a laptop are working on the
 * same row at the same time, which is normal on the morning of a flight. Whole
 * document writes would mean whichever saved second silently undid the other.
 *
 * Keys the vessel does not ask for are dropped rather than stored: a stale app
 * sending a row that has since been removed from the checklist should have no
 * effect, not leave an orphan in the map that no screen can ever clear.
 */
export async function patchAssignment(
  vesselId: number,
  userId: number,
  patch: CrewPatch,
  actor: SessionUser,
): Promise<CrewMember> {
  const [vessel] = await db
    .select({
      crewDocuments: vessels.crewDocuments,
      crewChecklist: vessels.crewChecklist,
      supervisorId: vessels.supervisorId,
      holdReportedAt: vessels.holdReportedAt,
    })
    .from(vessels)
    .where(eq(vessels.id, vesselId))
    .limit(1);
  if (!vessel) throw ApiError.notFound("No such vessel.");

  /* Once the gang is aboard the paperwork is history. Letting it be edited
     afterwards would mean a record of what was checked before a flight that
     can be rewritten after the fact, which is the opposite of what a joining
     sheet is for. The office can still reopen mobilisation if it was called
     early — see clearHoldReported. */
  if (vessel.holdReportedAt) {
    throw ApiError.badRequest(
      "The crew have reported to the hold. Joining paperwork is closed for this vessel.",
    );
  }

  const existing = await getAssignment(vesselId, userId);
  if (!existing) throw ApiError.notFound("That person is not on this vessel.");

  const documentKeys = new Set((vessel.crewDocuments ?? []).map((d) => d.key));
  const checklistKeys = new Set((vessel.crewChecklist ?? []).map((c) => c.key));

  const documents: DocumentMap = { ...(existing.documents ?? {}) };
  for (const [key, value] of Object.entries(patch.documents ?? {})) {
    if (!documentKeys.has(key)) continue;
    if (!isDocumentState(value)) {
      throw ApiError.badRequest(`Unknown document state "${String(value)}".`);
    }
    documents[key] = value;
  }

  const checklist: ChecklistMap = { ...(existing.checklist ?? {}) };
  for (const [key, value] of Object.entries(patch.checklist ?? {})) {
    if (!checklistKeys.has(key)) continue;
    checklist[key] = Boolean(value);
  }

  const travel: TravelMap = { ...(existing.travel ?? {}) };
  for (const [key, value] of Object.entries(patch.travel ?? {})) {
    if (!TRAVEL_KEYS.has(key)) continue;
    if (value === null) {
      travel[key] = null;
      continue;
    }
    const when = new Date(String(value));
    if (Number.isNaN(when.getTime())) {
      throw ApiError.badRequest(`"${key}" is not a valid time.`);
    }
    travel[key] = when.toISOString();
  }

  const [row] = await db
    .update(crewAssignments)
    .set({
      documents,
      checklist,
      travel,
      ...(patch.notes === undefined
        ? {}
        : { notes: patch.notes?.trim() || null }),
      updatedById: actor.sub,
      updatedByName: actor.name,
      updatedAt: new Date(),
    })
    .where(eq(crewAssignments.id, existing.id))
    .returning();

  const [person] = await db
    .select({
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!person) throw ApiError.notFound("No such user.");

  return toMember(row, person, vessel);
}

/* -------------------------------------------------------------------- */
/* Hold reporting — the switch                                          */
/* -------------------------------------------------------------------- */

/**
 * The crew are aboard. Mobilisation ends and the cleaning begins.
 *
 * Deliberately NOT blocked on everybody's paperwork being complete. A gang
 * standing on a deck has arrived whether or not somebody remembered to tick
 * their safety shoes, and an app that refuses to let them start work over a
 * missing tick is an app they will work around. The board shows what is
 * outstanding; the supervisor decides.
 *
 * Idempotent: calling it twice keeps the first time, because the first time is
 * the true one.
 */
export async function setHoldReported(
  vesselId: number,
  at: Date,
  actor: SessionUser,
): Promise<Vessel> {
  const [vessel] = await db
    .select()
    .from(vessels)
    .where(eq(vessels.id, vesselId))
    .limit(1);
  if (!vessel) throw ApiError.notFound("No such vessel.");
  if (vessel.holdReportedAt) return vessel;

  const [row] = await db
    .update(vessels)
    .set({
      holdReportedAt: at,
      holdReportedById: actor.sub,
      holdReportedByName: actor.name,
      /* The version is what every open phone and the customer page poll. Not
         bumping it here would leave a supervisor's app showing the joining
         board until they happened to pull to refresh. */
      version: vessel.version + 1,
      updatedAt: new Date(),
    })
    .where(eq(vessels.id, vesselId))
    .returning();

  return row;
}

/**
 * Undoes a hold report — for the case it was tapped on the wrong vessel.
 *
 * Office only, and it reopens the paperwork rather than deleting anything: the
 * answers are all still there, they simply become editable again.
 */
export async function clearHoldReported(vesselId: number): Promise<Vessel> {
  const [row] = await db
    .update(vessels)
    .set({
      holdReportedAt: null,
      holdReportedById: null,
      holdReportedByName: null,
      /* Bumped for the same reason setting it is: every open phone learns
         about this by polling the version, and one that does not move leaves
         a supervisor on the cleaning sheet of a vessel that has gone back to
         mobilising. */
      version: sql`${vessels.version} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(vessels.id, vesselId))
    .returning();
  if (!row) throw ApiError.notFound("No such vessel.");
  return row;
}
