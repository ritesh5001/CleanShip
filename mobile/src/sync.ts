import { ApiError, applyCellChanges, type CellChange } from "./api";
import { forVessel, readQueue, removeKeys, type QueuedChange } from "./queue";

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
  /**
   * Changes the server refused outright, with its reason.
   *
   * These are surfaced rather than swallowed. "Waiting to sync" is a promise
   * that the work will land; when the server has said no, repeating that
   * promise is a lie that ends with the entry being dropped and a supervisor
   * believing a hold was recorded when it was not.
   */
  rejected: { message: string; count: number }[];
};

export async function flushQueue(token: string): Promise<SyncResult> {
  let queue = await readQueue();
  if (queue.length === 0) {
    return {
      sent: 0,
      remaining: 0,
      offline: false,
      unauthorized: false,
      rejected: [],
    };
  }

  const vesselIds = [...new Set(queue.map((c) => c.vesselId))];
  let sent = 0;
  const rejected: { message: string; count: number }[] = [];

  for (const vesselId of vesselIds) {
    const batch = forVessel(queue, vesselId);
    if (batch.length === 0) continue;

    const changes: CellChange[] = batch.map((c) => ({
      compartmentId: c.compartmentId,
      stageKey: c.stageKey,
      status: c.status,
      note: c.note,
      startedAt: c.startedAt,
      completedAt: c.completedAt,
      occurredAt: c.occurredAt,
      idempotencyKey: c.key,
    }));

    try {
      await applyCellChanges(token, vesselId, changes);
      queue = await removeKeys(new Set(batch.map((c) => c.key)));
      sent += batch.length;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return {
          sent,
          remaining: queue.length,
          offline: false,
          unauthorized: true,
          rejected,
        };
      }
      if (err instanceof ApiError && err.isTransient) {
        /* Still no signal, or the server is waking. Stop the whole flush:
           later vessels would fail the same way, and hammering a cold server
           only makes the wait longer. */
        return {
          sent,
          remaining: queue.length,
          offline: true,
          unauthorized: false,
          rejected,
        };
      }
      /* A real refusal — a validation error, a vessel reassigned away, a
         compartment deleted. Retrying cannot change the answer, so the entry
         is dropped now rather than after eight pointless attempts, and the
         reason is handed back so the supervisor is told instead of watching
         a counter that never clears. */
      rejected.push({
        message:
          err instanceof ApiError ? err.message : "The server refused this update.",
        count: batch.length,
      });
      queue = await removeKeys(new Set(batch.map((c) => c.key)));
    }
  }

  return {
    sent,
    remaining: queue.length,
    offline: false,
    unauthorized: false,
    rejected,
  };
}

/**
 * Applies pending taps on top of server data.
 *
 * The screen must show what the supervisor did, not what the server last
 * knew — otherwise a tap made offline appears to undo itself. Applying the
 * queue in order reproduces exactly the state they are looking at.
 */
export function overlayPending<
  T extends {
    id: number;
    cells: Record<
      string,
      {
        status: string;
        note: string | null;
        startedAt?: string | null;
        completedAt?: string | null;
      }
    >;
  },
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

      /* Mirror the API's own rules so the screen does not disagree with the
         server once the queue drains. See resolveTimes in the backend. */
      const when = change.occurredAt;
      let startedAt = existing?.startedAt ?? null;
      let completedAt = existing?.completedAt ?? null;

      if (change.status === "pending" || change.status === "na") {
        startedAt = null;
        completedAt = null;
      } else if (change.status === "in_progress") {
        startedAt = startedAt ?? when;
        completedAt = null;
      } else if (change.status === "done") {
        completedAt = completedAt ?? when;
      }

      if (change.startedAt !== undefined) startedAt = change.startedAt;
      if (change.completedAt !== undefined) completedAt = change.completedAt;

      cells[change.stageKey] = {
        ...(existing ?? { status: "pending", note: null }),
        status: change.status,
        note: change.note === undefined ? (existing?.note ?? null) : change.note,
        startedAt,
        completedAt,
      } as (typeof cells)[string];
    }
    return { ...compartment, cells };
  });
}
