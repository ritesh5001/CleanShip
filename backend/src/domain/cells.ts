import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  cellEvents,
  cells,
  compartments,
  vessels,
  type Vessel,
} from "../db/schema.js";
import { compartmentState, type CellStatus } from "./stages.js";
import { ApiError } from "../http/errors.js";
import type { SessionUser } from "../auth/roles.js";

/**
 * Everything a supervisor actually does: move one cell, or a row, or a column.
 *
 * Each write runs in a transaction that also bumps `vessels.version`, so a
 * client polling for changes can never observe an updated cell with an
 * unchanged version — which would make it stop polling and show stale progress
 * to someone standing on deck disputing it.
 */

export type CellChange = {
  compartmentId: number;
  stageKey: string;
  status: CellStatus;
  /** Replaces the note. `null` clears it; omit to leave it alone. */
  note?: string | null;
  /** When the supervisor tapped, not when the server heard about it. */
  occurredAt?: Date;
  /** Client-generated. Makes an offline replay safe to retry. */
  idempotencyKey?: string | null;
};

export type ApplyResult = {
  vesselId: number;
  version: number;
  status: Vessel["status"];
  applied: number;
  /** True when an idempotency key had already been recorded. */
  duplicate: boolean;
};

/* -------------------------------------------------------------------- */

/**
 * Recomputes the vessel's own status from its cells.
 *
 * The supervisor never sets vessel status by hand: it is a step people forget,
 * and then clients chase the office about a vessel that finished on Tuesday.
 * `cancelled` is the one status a human owns, so it is never overwritten here.
 */
async function recomputeStatus(
  tx: typeof db,
  vessel: Vessel,
  at: Date,
): Promise<{ version: number; status: Vessel["status"] }> {
  const rows = await tx
    .select({
      compartmentId: cells.compartmentId,
      stageKey: cells.stageKey,
      status: cells.status,
    })
    .from(cells)
    .where(eq(cells.vesselId, vessel.id));

  /* Only stages the vessel still has. A column removed from the checklist has
     its cells deleted with it, so this is belt-and-braces — but a stale cell
     silently holding a vessel at 99% would be a maddening bug to find. */
  const live = new Set((vessel.stages ?? []).map((s) => s.key));
  const byCompartment = new Map<number, CellStatus[]>();
  for (const r of rows) {
    if (!live.has(r.stageKey)) continue;
    const list = byCompartment.get(r.compartmentId) ?? [];
    list.push(r.status);
    byCompartment.set(r.compartmentId, list);
  }

  const states = [...byCompartment.values()].map((s) => compartmentState(s));
  const everyDone = states.length > 0 && states.every((s) => s === "complete");
  const anyStarted = states.some((s) => s !== "not-started");

  const status: Vessel["status"] =
    vessel.status === "cancelled"
      ? "cancelled"
      : everyDone
        ? "complete"
        : anyStarted
          ? "in-progress"
          : "scheduled";

  const [updated] = await tx
    .update(vessels)
    .set({
      version: vessel.version + 1,
      status,
      startedAt: vessel.startedAt ?? (anyStarted ? at : null),
      completedAt: everyDone ? (vessel.completedAt ?? at) : null,
      updatedAt: new Date(),
    })
    .where(eq(vessels.id, vessel.id))
    .returning({ version: vessels.version, status: vessels.status });

  return updated;
}

/**
 * Applies a batch of cell changes as one unit.
 *
 * A batch rather than a single cell because the real gestures are "mark this
 * whole hold dry-cleaned" and "HP washing done on every hold" — sending those
 * as six requests means six chances for a dock connection to drop half of them.
 */
export async function applyCellChanges(
  vesselId: number,
  changes: CellChange[],
  actor: SessionUser,
): Promise<ApplyResult> {
  if (changes.length === 0) throw ApiError.badRequest("No changes supplied.");
  if (changes.length > 200) {
    throw ApiError.badRequest("Too many changes in one request.");
  }

  return db.transaction(async (tx) => {
    const [vessel] = await tx
      .select()
      .from(vessels)
      .where(eq(vessels.id, vesselId))
      .limit(1)
      .for("update");
    if (!vessel) throw ApiError.notFound("No such vessel.");

    const stages = vessel.stages ?? [];
    const stageByKey = new Map(stages.map((s) => [s.key, s]));

    /* Idempotency is enforced by the unique index, not by this pre-check:
       two offline replays arriving together would both pass a check and both
       apply. The check is only here to answer "already done" cheaply and
       without an error; the index is what makes it safe. */
    const keys = changes.map((c) => c.idempotencyKey).filter(Boolean) as string[];
    if (keys.length) {
      const seen = await tx
        .select({ key: cellEvents.idempotencyKey })
        .from(cellEvents)
        .where(inArray(cellEvents.idempotencyKey, keys));
      if (seen.length === keys.length && keys.length === changes.length) {
        return {
          vesselId: vessel.id,
          version: vessel.version,
          status: vessel.status,
          applied: 0,
          duplicate: true,
        };
      }
    }

    const compIds = [...new Set(changes.map((c) => c.compartmentId))];
    const comps = await tx
      .select({ id: compartments.id, label: compartments.label, vesselId: compartments.vesselId })
      .from(compartments)
      .where(inArray(compartments.id, compIds));
    const compById = new Map(comps.map((c) => [c.id, c]));

    const at = new Date();
    let applied = 0;

    for (const change of changes) {
      const comp = compById.get(change.compartmentId);
      if (!comp || comp.vesselId !== vessel.id) {
        throw ApiError.badRequest(
          `Compartment ${change.compartmentId} does not belong to this vessel.`,
        );
      }
      const stage = stageByKey.get(change.stageKey);
      if (!stage) {
        throw ApiError.badRequest(`Unknown stage "${change.stageKey}".`);
      }

      const [existing] = await tx
        .select()
        .from(cells)
        .where(
          and(
            eq(cells.compartmentId, comp.id),
            eq(cells.stageKey, change.stageKey),
          ),
        )
        .limit(1);

      const from: CellStatus = existing?.status ?? "pending";
      const note =
        change.note === undefined ? (existing?.note ?? null) : change.note;

      /* A no-op still records nothing rather than a misleading audit line. */
      if (existing && from === change.status && (existing.note ?? null) === note) {
        continue;
      }

      if (existing) {
        await tx
          .update(cells)
          .set({
            status: change.status,
            note,
            updatedById: actor.sub,
            updatedByName: actor.name,
            updatedAt: at,
          })
          .where(eq(cells.id, existing.id));
      } else {
        await tx.insert(cells).values({
          vesselId: vessel.id,
          compartmentId: comp.id,
          stageKey: change.stageKey,
          status: change.status,
          note,
          updatedById: actor.sub,
          updatedByName: actor.name,
          updatedAt: at,
        });
      }

      await tx.insert(cellEvents).values({
        vesselId: vessel.id,
        compartmentId: comp.id,
        compartmentLabel: comp.label,
        stageKey: change.stageKey,
        stageLabel: stage.label,
        fromStatus: from,
        toStatus: change.status,
        note,
        userId: actor.sub,
        userName: actor.name,
        occurredAt: change.occurredAt ?? at,
        idempotencyKey: change.idempotencyKey ?? null,
      });

      applied += 1;
    }

    const rolled = await recomputeStatus(tx as unknown as typeof db, vessel, at);

    return {
      vesselId: vessel.id,
      version: rolled.version,
      status: rolled.status,
      applied,
      duplicate: false,
    };
  });
}

/** Convenience for the single-tap path, which is most of the traffic. */
export function applyCellChange(
  vesselId: number,
  change: CellChange,
  actor: SessionUser,
) {
  return applyCellChanges(vesselId, [change], actor);
}

/**
 * Marks one stage across every compartment — the "HP washing is done on all
 * holds" gesture, which is a single tap on the column heading.
 */
export async function applyToColumn(
  vesselId: number,
  stageKey: string,
  status: CellStatus,
  actor: SessionUser,
) {
  const comps = await db
    .select({ id: compartments.id })
    .from(compartments)
    .where(eq(compartments.vesselId, vesselId));
  return applyCellChanges(
    vesselId,
    comps.map((c) => ({ compartmentId: c.id, stageKey, status })),
    actor,
  );
}

/** Marks every stage of one compartment — "Hold 3 is finished". */
export async function applyToRow(
  vesselId: number,
  compartmentId: number,
  status: CellStatus,
  actor: SessionUser,
) {
  const [vessel] = await db
    .select({ stages: vessels.stages })
    .from(vessels)
    .where(eq(vessels.id, vesselId))
    .limit(1);
  if (!vessel) throw ApiError.notFound("No such vessel.");
  return applyCellChanges(
    vesselId,
    (vessel.stages ?? []).map((s) => ({
      compartmentId,
      stageKey: s.key,
      status,
    })),
    actor,
  );
}

/** A compartment-level note, separate from any one stage. */
export async function setCompartmentNote(
  vesselId: number,
  compartmentId: number,
  note: string | null,
) {
  const [row] = await db
    .update(compartments)
    .set({ notes: note, updatedAt: new Date() })
    .where(
      and(eq(compartments.id, compartmentId), eq(compartments.vesselId, vesselId)),
    )
    .returning();
  if (!row) throw ApiError.notFound("No such compartment.");
  await db
    .update(vessels)
    .set({ version: sql`${vessels.version} + 1`, updatedAt: new Date() })
    .where(eq(vessels.id, vesselId));
  return row;
}
