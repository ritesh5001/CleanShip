import { ApiError, applyCellChanges, type CellChange } from "./api";
import { forVessel, penalise, readQueue, removeKeys, type QueuedChange } from "./queue";

/**
 * Pushing the queue to the API.
 *
 * One vessel at a time, because the endpoint is per-vessel and mixing them
 * into one call would mean a rejection on one vessel losing the work queued
 * for another.
 *
 * The distinction that matters is between "could not send" and "was refused".
 * A network failure or a 5xx leaves the queue intact to retry. A 4xx will
 * never succeed — a compartment deleted, a vessel reassigned, a revoked
 * session — so it is counted against the entry rather than retried forever,
 * and dropped once it is clearly not going anywhere.
 */

export type SyncResult = {
  sent: number;
  remaining: number;
  /** Set when the whole flush stopped early; the queue is untouched. */
  offline: boolean;
  /** Set when the API rejected the session. The caller signs out. */
  unauthorized: boolean;
};

export async function flushQueue(token: string): Promise<SyncResult> {
  let queue = await readQueue();
  if (queue.length === 0) {
    return { sent: 0, remaining: 0, offline: false, unauthorized: false };
  }

  const vesselIds = [...new Set(queue.map((c) => c.vesselId))];
  let sent = 0;

  for (const vesselId of vesselIds) {
    const batch = forVessel(queue, vesselId);
    if (batch.length === 0) continue;

    const changes: CellChange[] = batch.map((c) => ({
      compartmentId: c.compartmentId,
      stageKey: c.stageKey,
      status: c.status,
      note: c.note,
      occurredAt: c.occurredAt,
      idempotencyKey: c.key,
    }));

    try {
      await applyCellChanges(token, vesselId, changes);
      queue = await removeKeys(new Set(batch.map((c) => c.key)));
      sent += batch.length;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { sent, remaining: queue.length, offline: false, unauthorized: true };
      }
      if (err instanceof ApiError && err.isTransient) {
        /* Still no signal, or the server is waking. Stop the whole flush:
           later vessels would fail the same way, and hammering a cold server
           only makes the wait longer. */
        return { sent, remaining: queue.length, offline: true, unauthorized: false };
      }
      /* A real refusal. Count it and move on so one bad entry cannot block
         the vessels queued behind it. */
      queue = await penalise(new Set(batch.map((c) => c.key)));
    }
  }

  return { sent, remaining: queue.length, offline: false, unauthorized: false };
}

/**
 * Applies pending taps on top of server data.
 *
 * The screen must show what the supervisor did, not what the server last
 * knew — otherwise a tap made offline appears to undo itself. Applying the
 * queue in order reproduces exactly the state they are looking at.
 */
export function overlayPending<
  T extends { id: number; cells: Record<string, { status: string; note: string | null }> },
>(compartments: T[], pending: QueuedChange[]): T[] {
  if (pending.length === 0) return compartments;

  const byCompartment = new Map<number, QueuedChange[]>();
  for (const change of pending) {
    const list = byCompartment.get(change.compartmentId) ?? [];
    list.push(change);
    byCompartment.set(change.compartmentId, list);
  }

  return compartments.map((compartment) => {
    const changes = byCompartment.get(compartment.id);
    if (!changes) return compartment;

    const cells = { ...compartment.cells };
    for (const change of changes) {
      const existing = cells[change.stageKey];
      cells[change.stageKey] = {
        ...(existing ?? { status: "pending", note: null }),
        status: change.status,
        note: change.note === undefined ? (existing?.note ?? null) : change.note,
      } as (typeof cells)[string];
    }
    return { ...compartment, cells };
  });
}
