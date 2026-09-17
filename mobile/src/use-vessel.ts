import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, getVessel } from "./api";
import { readVessel, writeVessel } from "./cache";
import {
  enqueue,
  forVessel,
  readQueue,
  subscribe,
  type QueuedChange,
} from "./queue";
import { overlayPending } from "./sync";
import { useSession } from "./session";
import type { SyncState } from "./components/sync-strip";
import {
  vesselTimeWindow,
  type CellStatus,
  type CompartmentDetail,
  type TimeWindow,
  type VesselDetail,
} from "./types";

/**
 * One vessel, with this phone's un-synced taps laid on top of it.
 *
 * Everything a screen needs to show a vessel truthfully: the server's copy,
 * the cache to fall back on, the device queue, and the overlay that keeps a
 * tap visible between being made and being sent. Two screens draw the same
 * vessel now — the status grid and the time log — and the overlay is the
 * part that absolutely must not differ between them. A supervisor who marks a
 * hold done on one screen and sees it blank on the other stops trusting both.
 *
 * What is NOT here, deliberately: the activity log, the office-changed-it
 * notice, and crew presence. Those belong to the status screen alone, and
 * pulling them in would make every consumer pay for a 200-row fetch.
 */
export function useVessel(vesselId: number) {
  const { token, signOut } = useSession();

  const [vessel, setVessel] = useState<VesselDetail | null>(null);
  const [pending, setPending] = useState<QueuedChange[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* How many of this vessel's taps were on the device last time we looked — a
     drop means the sync landed and the server now has them. */
  const pendingCount = useRef(0);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token || !Number.isInteger(vesselId)) return;
      try {
        const fresh = await getVessel(token, vesselId, signal);
        if (signal?.aborted) return;
        setVessel(fresh);
        setStale(false);
        setError(null);
        void writeVessel(fresh);
      } catch (err) {
        if (signal?.aborted) return;
        if (err instanceof ApiError && err.status === 401) {
          await signOut();
          return;
        }
        const cached = await readVessel(vesselId);
        if (cached) {
          setVessel((current) => current ?? cached.data);
          setStale(true);
        }
        setError(
          err instanceof ApiError && err.status === 403
            ? "This vessel is no longer assigned to you."
            : err instanceof ApiError && err.isTransient
              ? "No connection. Showing the last update from this phone — your edits are still saved."
              : "Could not load this vessel.",
        );
      }
    },
    [token, vesselId, signOut],
  );

  const refreshPending = useCallback(async () => {
    const queue = await readQueue();
    const mine = forVessel(queue, vesselId);
    pendingCount.current = mine.length;
    setPending(mine);
  }, [vesselId]);

  useEffect(() => {
    const controller = new AbortController();
    void readVessel(vesselId).then((cached) => {
      if (cached) {
        setVessel((current) => current ?? cached.data);
        setStale(true);
      }
    });
    void load(controller.signal);
    void refreshPending();
    return () => controller.abort();
  }, [load, refreshPending, vesselId]);

  /**
   * Follows the queue, and refetches the moment it drains.
   *
   * The overlay is the only thing showing an edit that has not reached the
   * server. When the sync succeeds the entry is dropped from the queue — and
   * without this refetch the screen falls back to whatever the server said
   * when it was opened, which is the edit undone.
   */
  useEffect(() => {
    return subscribe((queue) => {
      const mine = forVessel(queue, vesselId);
      const drained = mine.length < pendingCount.current;
      pendingCount.current = mine.length;
      setPending(mine);
      if (drained) void load();
    });
  }, [vesselId, load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([load(), refreshPending()]);
    setRefreshing(false);
  }, [load, refreshPending]);

  /* What the supervisor is looking at: the server's picture with their own
     un-synced taps laid on top, so nothing they did appears to undo itself. */
  const compartments: CompartmentDetail[] = useMemo(
    () => (vessel ? overlayPending(vessel.compartments, pending) : []),
    [vessel, pending],
  );

  /* Sent at least once and come back: `attempts > 0` is the tell, and it is
     what separates "not tried yet" from "the server said no". Callers key
     their own per-cell or per-time sets off `pending`; the shapes they need
     differ enough that one set here would suit neither. */
  const syncState: SyncState = useMemo(() => {
    if (pending.length === 0) return "synced";
    if (pending.some((p) => p.attempts > 0)) return "failed";
    return stale ? "queued" : "syncing";
  }, [pending, stale]);

  const window: TimeWindow = useMemo(() => vesselTimeWindow(vessel), [vessel]);

  /** Writes a change to the device queue. The network is a background concern. */
  const setCell = useCallback(
    async (
      compartmentId: number,
      stageKey: string,
      status: CellStatus,
      times?: { startedAt?: string | null; completedAt?: string | null },
    ) => {
      const queue = await enqueue({
        vesselId,
        compartmentId,
        stageKey,
        status,
        ...(times ?? {}),
      });
      setPending(forVessel(queue, vesselId));
    },
    [vesselId],
  );

  return {
    vessel,
    compartments,
    pending,
    syncState,
    window,
    error,
    stale,
    refreshing,
    refresh,
    setCell,
  };
}
