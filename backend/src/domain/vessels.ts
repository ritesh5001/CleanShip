import crypto from "node:crypto";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  cellEvents,
  cells,
  clients,
  compartments,
  crewAssignments,
  users,
  vessels,
  type Cell,
  type Compartment,
  type Vessel,
} from "../db/schema.js";
import {
  compartmentState,
  defaultCompartmentLabels,
  progressOf,
  stageKeyFrom,
  type CellStatus,
  type CompartmentState,
  type Progress,
  type Stage,
} from "./stages.js";
import {
  DEFAULT_CREW_CHECKLIST,
  DEFAULT_CREW_DOCUMENTS,
  normaliseCrewItems,
  type CrewChecklistItem,
  type CrewDocumentItem,
} from "./crew.js";
import { ApiError } from "../http/errors.js";
import { isOffice, type SessionUser } from "../auth/roles.js";

/* -------------------------------------------------------------------- */
/* Shapes the API returns                                               */
/* -------------------------------------------------------------------- */

export type VesselSummary = Vessel & {
  clientName: string | null;
  supervisorName: string | null;
  progress: Progress & { compartmentsComplete: number; compartmentsTotal: number };
};

export type CompartmentDetail = Compartment & {
  /** Keyed by stage key, so the grid is a lookup rather than a search. */
  cells: Record<
    string,
    Pick<
      Cell,
      | "id"
      | "status"
      | "note"
      | "startedAt"
      | "completedAt"
      | "updatedAt"
      | "updatedByName"
    >
  >;
  state: CompartmentState;
  progress: Progress;
  /**
   * When work on this compartment began and ended: the earliest start and the
   * latest finish across its stages. `completedAt` is null until every stage
   * that applies has one — a hold is not finished while any of it is still
   * running, and reporting the latest finish so far would overstate it.
   */
  startedAt: Date | null;
  completedAt: Date | null;
};

export type VesselDetail = VesselSummary & {
  compartments: CompartmentDetail[];
};

/* -------------------------------------------------------------------- */
/* Reads                                                                */
/* -------------------------------------------------------------------- */

const summarySelect = {
  vessel: vessels,
  clientName: clients.name,
  supervisorName: users.name,
};

function baseQuery() {
  return db
    .select(summarySelect)
    .from(vessels)
    .leftJoin(clients, eq(vessels.clientId, clients.id))
    .leftJoin(users, eq(vessels.supervisorId, users.id));
}

/**
 * Progress for a whole vessel.
 *
 * Every cell across every compartment, with `na` excluded — see progressOf.
 * Rolled up here rather than in SQL because the weighting rule (in-progress
 * counts half) lives in one place and both the row and the vessel use it.
 */
export function rollUp(stages: Stage[], rows: { compartmentId: number; stageKey: string; status: CellStatus }[], compartmentCount: number) {
  const keys = new Set(stages.map((s) => s.key));
  const relevant = rows.filter((r) => keys.has(r.stageKey));
  const overall = progressOf(relevant.map((r) => r.status));

  const byCompartment = new Map<number, CellStatus[]>();
  for (const r of relevant) {
    const list = byCompartment.get(r.compartmentId) ?? [];
    list.push(r.status);
    byCompartment.set(r.compartmentId, list);
  }
  let complete = 0;
  for (const statuses of byCompartment.values()) {
    if (compartmentState(statuses) === "complete") complete += 1;
  }

  return {
    ...overall,
    compartmentsComplete: complete,
    compartmentsTotal: compartmentCount,
  };
}

async function attachProgress(
  rows: { vessel: Vessel; clientName: string | null; supervisorName: string | null }[],
): Promise<VesselSummary[]> {
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.vessel.id);
  /* One query for every vessel's cells rather than one per vessel: the admin
     board lists everything in the yard and N+1 there is felt immediately. */
  const allCells = await db
    .select({
      vesselId: cells.vesselId,
      compartmentId: cells.compartmentId,
      stageKey: cells.stageKey,
      status: cells.status,
    })
    .from(cells)
    .where(inArray(cells.vesselId, ids));

  const grouped = new Map<number, typeof allCells>();
  for (const c of allCells) {
    const list = grouped.get(c.vesselId) ?? [];
    list.push(c);
    grouped.set(c.vesselId, list);
  }

  return rows.map((r) => ({
    ...r.vessel,
    clientName: r.clientName,
    supervisorName: r.supervisorName,
    progress: rollUp(
      r.vessel.stages ?? [],
      grouped.get(r.vessel.id) ?? [],
      r.vessel.compartmentCount,
    ),
  }));
}

/** Every vessel. Admin and editor only — the route enforces that. */
export async function listVessels(): Promise<VesselSummary[]> {
  const rows = await baseQuery().orderBy(desc(vessels.createdAt));
  return attachProgress(rows);
}

/** Only what this supervisor has been assigned. */
export async function listVesselsForSupervisor(
  supervisorId: number,
): Promise<VesselSummary[]> {
  const rows = await baseQuery()
    .where(eq(vessels.supervisorId, supervisorId))
    .orderBy(desc(vessels.createdAt));
  return attachProgress(rows);
}

/**
 * The list a session is entitled to, without the caller deciding which.
 *
 * Written to FAIL CLOSED. It used to read "supervisors get their own,
 * everyone else gets all of them", which was true while every account that
 * could sign in was staff. The moment `crew` existed that shape handed a
 * joiner every vessel in the company, because they are not a supervisor and
 * so fell into the else. Roles that should see nothing now see nothing, and a
 * role added tomorrow gets the same answer until somebody decides otherwise.
 */
export function listVesselsFor(session: SessionUser) {
  if (isOffice(session.role)) return listVessels();
  if (session.role === "supervisor") return listVesselsForSupervisor(session.sub);
  return Promise.resolve([] as VesselSummary[]);
}

export async function getVessel(id: number): Promise<Vessel | null> {
  const [row] = await db.select().from(vessels).where(eq(vessels.id, id)).limit(1);
  return row ?? null;
}

export async function getVesselDetail(id: number): Promise<VesselDetail | null> {
  const [row] = await baseQuery().where(eq(vessels.id, id)).limit(1);
  if (!row) return null;

  const [comps, cellRows] = await Promise.all([
    db
      .select()
      .from(compartments)
      .where(eq(compartments.vesselId, id))
      .orderBy(compartments.position),
    db.select().from(cells).where(eq(cells.vesselId, id)),
  ]);

  const stages = row.vessel.stages ?? [];
  const stageKeys = stages.map((s) => s.key);

  const byCompartment = new Map<number, Cell[]>();
  for (const c of cellRows) {
    const list = byCompartment.get(c.compartmentId) ?? [];
    list.push(c);
    byCompartment.set(c.compartmentId, list);
  }

  const detail: CompartmentDetail[] = comps.map((comp) => {
    const own = byCompartment.get(comp.id) ?? [];
    const map: CompartmentDetail["cells"] = {};
    for (const c of own) {
      map[c.stageKey] = {
        id: c.id,
        status: c.status,
        note: c.note,
        startedAt: c.startedAt,
        completedAt: c.completedAt,
        updatedAt: c.updatedAt,
        updatedByName: c.updatedByName,
      };
    }
    /* Read statuses in stage order, and treat a stage with no row yet as
       pending — a vessel whose stage list gained a column should render, not
       throw, before anyone has touched the new column. */
    const statuses = stageKeys.map((k) => map[k]?.status ?? "pending");

    /* Only stages that apply. An `na` cell is not work, so it neither starts
       the clock nor holds the compartment open. */
    const live = stageKeys
      .map((k) => map[k])
      .filter((cell) => cell && cell.status !== "na");

    const starts = live
      .map((cell) => cell!.startedAt)
      .filter((d): d is Date => Boolean(d));
    const finishes = live
      .map((cell) => cell!.completedAt)
      .filter((d): d is Date => Boolean(d));

    const everyLiveStageFinished =
      live.length > 0 && finishes.length === live.length;

    return {
      ...comp,
      cells: map,
      state: compartmentState(statuses),
      progress: progressOf(statuses),
      startedAt: starts.length
        ? new Date(Math.min(...starts.map((d) => d.getTime())))
        : null,
      completedAt: everyLiveStageFinished
        ? new Date(Math.max(...finishes.map((d) => d.getTime())))
        : null,
    };
  });

  return {
    ...row.vessel,
    clientName: row.clientName,
    supervisorName: row.supervisorName,
    progress: rollUp(
      stages,
      cellRows.map((c) => ({
        compartmentId: c.compartmentId,
        stageKey: c.stageKey,
        status: c.status,
      })),
      row.vessel.compartmentCount,
    ),
    compartments: detail,
  };
}

export async function getVesselByShareToken(token: string) {
  const [row] = await db
    .select({ id: vessels.id, revoked: vessels.shareRevoked })
    .from(vessels)
    .where(eq(vessels.shareToken, token))
    .limit(1);
  if (!row || row.revoked) return null;
  return getVesselDetail(row.id);
}

/** Lightweight poll target: two columns, no joins. */
export async function getVesselVersion(id: number) {
  const [row] = await db
    .select({ version: vessels.version, status: vessels.status, supervisorId: vessels.supervisorId })
    .from(vessels)
    .where(eq(vessels.id, id))
    .limit(1);
  return row ?? null;
}

/** The audit trail, newest first. */
/**
 * The single most recent change on each hold or tank, newest first.
 *
 * What the activity views show: one line per compartment, not its whole
 * history — work on Hold 1 today replaces the entry for Hold 1 from last week.
 * Chosen in SQL with DISTINCT ON rather than by trimming a limited list,
 * because a limit applied first would let a busy hold push a quiet one's
 * latest entry off the end entirely. The full trail stays in the table.
 */
export async function listLatestEvents(vesselId: number) {
  const rows = await db
    .selectDistinctOn([cellEvents.compartmentId])
    .from(cellEvents)
    .where(eq(cellEvents.vesselId, vesselId))
    .orderBy(
      cellEvents.compartmentId,
      desc(cellEvents.occurredAt),
      desc(cellEvents.id),
    );
  return rows.sort(
    (a, b) =>
      b.occurredAt.getTime() - a.occurredAt.getTime() || b.id - a.id,
  );
}

export function listEvents(vesselId: number, limit = 200) {
  return db
    .select()
    .from(cellEvents)
    .where(eq(cellEvents.vesselId, vesselId))
    .orderBy(desc(cellEvents.occurredAt))
    .limit(Math.min(limit, 500));
}

/* -------------------------------------------------------------------- */
/* Creating a vessel                                                    */
/* -------------------------------------------------------------------- */

export function newShareToken() {
  return crypto.randomBytes(24).toString("base64url");
}

/**
 * CT-YYMM-NN.
 *
 * Derived from a count, so it is readable and roughly chronological. Two
 * vessels created in the same second could collide on the count; the unique
 * index catches that and `createVessel` retries, which is cheaper than a
 * sequence per month.
 */
async function nextReference(): Promise<string> {
  const now = new Date();
  const stem = `CT-${String(now.getUTCFullYear()).slice(2)}${String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(vessels)
    .where(sql`${vessels.reference} like ${stem + "%"}`);
  return `${stem}-${String((row?.count ?? 0) + 1).padStart(2, "0")}`;
}

export type StageInput = { key?: string; label: string; short?: string };

export type CreateVesselInput = {
  name: string;
  imo?: string | null;
  port: string;
  berth?: string | null;
  destination?: string | null;
  type: "hold" | "tank";
  clientId?: number | null;
  supervisorId?: number | null;
  compartmentCount: number;
  /** Optional per-compartment names. Defaults are filled in for any missing. */
  compartmentLabels?: string[];
  /** The admin's stage list, in order. Keys are derived from labels. */
  stages: StageInput[];
  /**
   * What this vessel asks its joiners for. Omitted means the standard sheet —
   * an admin who does not care gets the printed list they already use.
   */
  crewDocuments?: { key?: string; label: string }[];
  crewChecklist?: { key?: string; label: string }[];
  /**
   * Who is joining this vessel. The assigned supervisor is added whether or not
   * they are listed here — they carry the same paperwork onto the same flight.
   */
  crewIds?: number[];
  scheduledFor?: Date | null;
  notes?: string | null;
};

/**
 * Checks a proposed roster before anything is written.
 *
 * Only crew and supervisor accounts, and only active ones. An office account
 * on a joining roster would get a joining sheet it has no app to fill in, and a
 * disabled account would sit on the board as a column nobody can ever complete.
 */
async function validateRoster(userIds: number[]) {
  if (userIds.length === 0) return;
  const found = await db
    .select({ id: users.id, role: users.role, active: users.active, name: users.name })
    .from(users)
    .where(inArray(users.id, userIds));

  const byId = new Map(found.map((u) => [u.id, u]));
  for (const id of userIds) {
    const u = byId.get(id);
    if (!u) throw ApiError.badRequest("One of the chosen crew accounts no longer exists.");
    if (!u.active) throw ApiError.badRequest(`${u.name}'s account is disabled.`);
    if (u.role !== "crew" && u.role !== "supervisor") {
      throw ApiError.badRequest(`${u.name} is an office account and cannot join a vessel.`);
    }
  }
}

/** Turns the admin's typed stage list into stored stages with stable keys. */
export function normaliseStages(input: StageInput[]): Stage[] {
  const taken = new Set<string>();
  return input.map((s) => {
    const label = s.label.trim();
    const key = s.key?.trim() || stageKeyFrom(label, taken);
    taken.add(key);
    return {
      key,
      label,
      short: (s.short?.trim() || label).slice(0, 12),
    };
  });
}

/**
 * Creates the vessel, its compartments and every cell in one transaction.
 *
 * All three or none: a vessel with no compartments is a screen the supervisor
 * opens to nothing, which is worse than the create having failed visibly.
 */
export async function createVessel(
  input: CreateVesselInput,
  actor: SessionUser,
): Promise<Vessel> {
  const stages = normaliseStages(input.stages);
  if (stages.length === 0) {
    throw ApiError.badRequest("A vessel needs at least one stage.");
  }

  /* The supervisor joins with their gang, so they are always on the roster.
     Deduplicated, so ticking them in the crew list as well is harmless. */
  const roster = [
    ...new Set([
      ...(input.crewIds ?? []),
      ...(input.supervisorId ? [input.supervisorId] : []),
    ]),
  ];
  await validateRoster(roster);

  const labels = defaultCompartmentLabels(input.type, input.compartmentCount).map(
    (fallback, i) => (input.compartmentLabels?.[i]?.trim() || fallback).slice(0, 40),
  );

  for (let attempt = 0; ; attempt++) {
    const reference = await nextReference();
    try {
      return await db.transaction(async (tx) => {
        const [vessel] = await tx
          .insert(vessels)
          .values({
            reference,
            name: input.name.trim(),
            imo: input.imo?.trim() || null,
            port: input.port.trim(),
            berth: input.berth?.trim() || null,
            destination: input.destination?.trim() || null,
            type: input.type,
            clientId: input.clientId ?? null,
            supervisorId: input.supervisorId ?? null,
            stages,
            crewDocuments: normaliseCrewItems(
              input.crewDocuments,
              DEFAULT_CREW_DOCUMENTS,
            ),
            crewChecklist: normaliseCrewItems(
              input.crewChecklist,
              DEFAULT_CREW_CHECKLIST,
            ),
            compartmentCount: input.compartmentCount,
            scheduledFor: input.scheduledFor ?? null,
            notes: input.notes?.trim() || null,
            shareToken: newShareToken(),
            createdById: actor.sub,
          })
          .returning();

        const comps = await tx
          .insert(compartments)
          .values(
            labels.map((label, i) => ({
              vesselId: vessel.id,
              position: i,
              label,
            })),
          )
          .returning({ id: compartments.id });

        await tx.insert(cells).values(
          comps.flatMap((c) =>
            stages.map((s) => ({
              vesselId: vessel.id,
              compartmentId: c.id,
              stageKey: s.key,
            })),
          ),
        );

        /* Inside the same transaction as the vessel: a vessel that exists with
           half its roster missing would show the office a board they believe
           is complete. */
        if (roster.length > 0) {
          await tx
            .insert(crewAssignments)
            .values(roster.map((userId) => ({ vesselId: vessel.id, userId })))
            .onConflictDoNothing();
        }

        return vessel;
      });
    } catch (err) {
      /* 23505 is a unique violation. The only one reachable here is the
         reference colliding with a vessel created in the same instant, and the
         fix for that is a fresh count, not a failed request. */
      const code = (err as { code?: string }).code;
      if (code === "23505" && attempt < 3) continue;
      throw err;
    }
  }
}

/* -------------------------------------------------------------------- */
/* Editing a vessel                                                     */
/* -------------------------------------------------------------------- */

export type UpdateVesselInput = Partial<{
  name: string;
  imo: string | null;
  port: string;
  berth: string | null;
  destination: string | null;
  clientId: number | null;
  supervisorId: number | null;
  status: "scheduled" | "in-progress" | "complete" | "cancelled";
  scheduledFor: Date | null;
  notes: string | null;
}>;

export async function updateVessel(id: number, patch: UpdateVesselInput) {
  /* Bumps the version so open phones and customer pages pick up a renamed
     vessel or a moved berth on their next poll. */
  const [row] = await db
    .update(vessels)
    .set({ ...patch, version: sql`${vessels.version} + 1`, updatedAt: new Date() })
    .where(eq(vessels.id, id))
    .returning();
  if (!row) throw ApiError.notFound("No such vessel.");
  return row;
}

/**
 * Hands a vessel to a supervisor.
 *
 * Separate from `updateVessel` even though it writes one column, because
 * assignment is the moment the vessel becomes someone's job — it is worth
 * being able to see it in a log and to hang a notification off later.
 */
export async function assignSupervisor(id: number, supervisorId: number | null) {
  if (supervisorId !== null) {
    const [supervisor] = await db
      .select({ id: users.id, role: users.role, active: users.active })
      .from(users)
      .where(eq(users.id, supervisorId))
      .limit(1);
    if (!supervisor) throw ApiError.badRequest("No such user.");
    if (supervisor.role !== "supervisor") {
      throw ApiError.badRequest("Only supervisor accounts can be assigned a vessel.");
    }
    if (!supervisor.active) {
      throw ApiError.badRequest("That supervisor account is deactivated.");
    }
  }
  const vessel = await updateVessel(id, { supervisorId });

  /* Same rule as at creation: the supervisor is on the joining roster. The
     previous supervisor, if any, is left on it — they may well still be
     going, and removing somebody's paperwork is the office's call to make on
     the board, not a side effect of a dropdown. */
  if (supervisorId !== null) {
    await db
      .insert(crewAssignments)
      .values({ vesselId: id, userId: supervisorId })
      .onConflictDoNothing();
  }
  return vessel;
}

/**
 * Changes a vessel's stage list after creation.
 *
 * Adding a stage creates its cells; removing one deletes them, and with them
 * the current status of that column. Renaming keeps the key, so the work
 * already recorded survives — which is why keys are never derived from the new
 * label here.
 */
/**
 * Replaces what a vessel asks its joiners for.
 *
 * Unlike `setStages` there is nothing to reconcile: answers live in a map
 * keyed by item key, so removing a row simply stops it being counted and
 * re-adding it under the same key brings the old answers back. Keys are only
 * ever derived for rows that arrive without one, so renaming a label leaves
 * every recorded answer where it is.
 *
 * Refused once the crew are aboard, for the same reason the paperwork itself
 * is: the list a job was worked to is part of its record.
 */
export async function setCrewLists(
  id: number,
  input: {
    documents?: { key?: string; label: string }[];
    checklist?: { key?: string; label: string }[];
  },
): Promise<Vessel> {
  const [vessel] = await db
    .select()
    .from(vessels)
    .where(eq(vessels.id, id))
    .limit(1);
  if (!vessel) throw ApiError.notFound("No such vessel.");
  if (vessel.holdReportedAt) {
    throw ApiError.badRequest(
      "The crew have reported to the hold. The joining list is closed for this vessel.",
    );
  }

  const crewDocuments: CrewDocumentItem[] = input.documents
    ? normaliseCrewItems(input.documents, DEFAULT_CREW_DOCUMENTS)
    : (vessel.crewDocuments ?? []);
  const crewChecklist: CrewChecklistItem[] = input.checklist
    ? normaliseCrewItems(input.checklist, DEFAULT_CREW_CHECKLIST)
    : (vessel.crewChecklist ?? []);

  const [row] = await db
    .update(vessels)
    .set({
      crewDocuments,
      crewChecklist,
      version: sql`${vessels.version} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(vessels.id, id))
    .returning();
  return row;
}

export async function setStages(id: number, input: StageInput[]) {
  const stages = normaliseStages(input);
  if (stages.length === 0) {
    throw ApiError.badRequest("A vessel needs at least one stage.");
  }

  return db.transaction(async (tx) => {
    const [vessel] = await tx
      .select()
      .from(vessels)
      .where(eq(vessels.id, id))
      .limit(1)
      .for("update");
    if (!vessel) throw ApiError.notFound("No such vessel.");

    const before = new Set((vessel.stages ?? []).map((s) => s.key));
    const after = new Set(stages.map((s) => s.key));

    const removed = [...before].filter((k) => !after.has(k));
    const added = stages.filter((s) => !before.has(s.key));

    if (removed.length) {
      await tx
        .delete(cells)
        .where(and(eq(cells.vesselId, id), inArray(cells.stageKey, removed)));
    }

    if (added.length) {
      const comps = await tx
        .select({ id: compartments.id })
        .from(compartments)
        .where(eq(compartments.vesselId, id));
      if (comps.length) {
        await tx.insert(cells).values(
          comps.flatMap((c) =>
            added.map((s) => ({
              vesselId: id,
              compartmentId: c.id,
              stageKey: s.key,
            })),
          ),
        );
      }
    }

    const [updated] = await tx
      .update(vessels)
      .set({ stages, version: vessel.version + 1, updatedAt: new Date() })
      .where(eq(vessels.id, id))
      .returning();
    return updated;
  });
}

/**
 * Changes the compartment list after creation.
 *
 * Compartments are matched by position: shrinking the count deletes the
 * trailing ones and everything recorded against them, so the route asks for
 * confirmation before calling this with a smaller number.
 */
export async function setCompartments(id: number, labels: string[]) {
  if (labels.length === 0) {
    throw ApiError.badRequest("A vessel needs at least one compartment.");
  }

  return db.transaction(async (tx) => {
    const [vessel] = await tx
      .select()
      .from(vessels)
      .where(eq(vessels.id, id))
      .limit(1)
      .for("update");
    if (!vessel) throw ApiError.notFound("No such vessel.");

    const existing = await tx
      .select()
      .from(compartments)
      .where(eq(compartments.vesselId, id))
      .orderBy(compartments.position);

    const stages = vessel.stages ?? [];

    for (const [i, label] of labels.entries()) {
      const current = existing[i];
      if (current) {
        if (current.label !== label) {
          await tx
            .update(compartments)
            .set({ label, updatedAt: new Date() })
            .where(eq(compartments.id, current.id));
        }
        continue;
      }
      const [created] = await tx
        .insert(compartments)
        .values({ vesselId: id, position: i, label })
        .returning({ id: compartments.id });
      if (stages.length) {
        await tx.insert(cells).values(
          stages.map((s) => ({
            vesselId: id,
            compartmentId: created.id,
            stageKey: s.key,
          })),
        );
      }
    }

    for (const surplus of existing.slice(labels.length)) {
      await tx.delete(compartments).where(eq(compartments.id, surplus.id));
    }

    const [updated] = await tx
      .update(vessels)
      .set({
        compartmentCount: labels.length,
        version: vessel.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(vessels.id, id))
      .returning();
    return updated;
  });
}

/** Issues a fresh link and kills the old one. Un-revokes, because that is
 *  what "issue a new link" means to the person clicking it. */
export async function rotateShareToken(id: number) {
  const [row] = await db
    .update(vessels)
    .set({ shareToken: newShareToken(), shareRevoked: 0, updatedAt: new Date() })
    .where(eq(vessels.id, id))
    .returning();
  if (!row) throw ApiError.notFound("No such vessel.");
  return row;
}

export async function setShareRevoked(id: number, revoked: boolean) {
  const [row] = await db
    .update(vessels)
    .set({ shareRevoked: revoked ? 1 : 0, updatedAt: new Date() })
    .where(eq(vessels.id, id))
    .returning();
  if (!row) throw ApiError.notFound("No such vessel.");
  return row;
}

export async function deleteVessel(id: number) {
  const [row] = await db.delete(vessels).where(eq(vessels.id, id)).returning({ id: vessels.id });
  if (!row) throw ApiError.notFound("No such vessel.");
  return row;
}
