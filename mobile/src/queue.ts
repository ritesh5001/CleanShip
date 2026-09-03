import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CellStatus } from "./types";

/**
 * The offline queue.
 *
 * This is the reason the app exists rather than a bookmark to the website. A
 * supervisor loses signal constantly — inside a hold, behind a shed, at anchor
 * — and if a tap is lost the paper sheet wins and the whole system is
 * pointless. So every tap is written to disk FIRST and sent second. The screen
 * updates from local state immediately; the network is a background concern.
 *
 * Each entry carries its own idempotency key, generated at the moment of the
 * tap. The API enforces those with a unique index rather than a pre-check,
 * which is what makes replaying a queue after an hour offline safe even if
 * some of it already landed.
 *
 * `occurredAt` is when the supervisor tapped, not when the server heard about
 * it. A hold finished at 02:10 and synced at 06:00 must report 02:10, or the
 * audit trail is worse than useless in the dispute it exists to settle.
 */

const QUEUE_KEY = "cleantrack.queue.v1";

export type QueuedChange = {
  key: string;
  vesselId: number;
  compartmentId: number;
  stageKey: string;
  status: CellStatus;
  note?: string | null;
  occurredAt: string;
  /** Bumped each time a send fails, so a poison entry can be dropped. */
  attempts: number;
};

/**
 * A change that has failed this many times is not going to succeed. Keeping it
 * forever would block everything queued behind it, which is the failure mode
 * that makes an offline feature untrustworthy.
 */
const MAX_ATTEMPTS = 8;

export function newKey() {
  /* Good enough for an idempotency key: it only has to be unique across one
     device's queue, and the API's unique index is the real guarantee. */
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function readQueue(): Promise<QueuedChange[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedChange[]) : [];
  } catch {
    return [];
  }
}

/**
 * Anyone who needs to know the queue changed.
 *
 * The app shell shows a standing "N updates waiting" bar, and it has to appear
 * the instant a tap is made with no signal — that bar is the only thing
 * telling a supervisor their work is safe. Polling for it would mean up to a
 * minute of silence at exactly the wrong moment, so writes announce
 * themselves instead.
 */
type Listener = (queue: QueuedChange[]) => void;
const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function writeQueue(queue: QueuedChange[]) {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* Storage full or unavailable. The in-memory state still carries this
       session's work; only a restart would lose it. Throwing here would lose
       the tap outright, which is worse. */
  }
  /* Announced even if the write above failed: the change is real in memory,
     and the count on screen should match what the person just did. */
  for (const listener of listeners) listener(queue);
}

/** Appends a tap. Returns the queue so callers can show the pending count. */
export async function enqueue(
  change: Omit<QueuedChange, "key" | "attempts" | "occurredAt"> &
    Partial<Pick<QueuedChange, "occurredAt">>,
): Promise<QueuedChange[]> {
  const queue = await readQueue();
  const next: QueuedChange[] = [
    ...queue,
    {
      ...change,
      key: newKey(),
      occurredAt: change.occurredAt ?? new Date().toISOString(),
      attempts: 0,
    },
  ];
  await writeQueue(next);
  return next;
}

/** Everything waiting for one vessel, oldest first. */
export function forVessel(queue: QueuedChange[], vesselId: number) {
  return queue.filter((c) => c.vesselId === vesselId);
}

export async function removeKeys(keys: Set<string>) {
  const queue = await readQueue();
  const next = queue.filter((c) => !keys.has(c.key));
  await writeQueue(next);
  return next;
}

/** Records a failed attempt and drops anything past saving. */
export async function penalise(keys: Set<string>) {
  const queue = await readQueue();
  const next = queue
    .map((c) => (keys.has(c.key) ? { ...c, attempts: c.attempts + 1 } : c))
    .filter((c) => c.attempts < MAX_ATTEMPTS);
  await writeQueue(next);
  return next;
}

export async function clearQueue() {
  await writeQueue([]);
}
