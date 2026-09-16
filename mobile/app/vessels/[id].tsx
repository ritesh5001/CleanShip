import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { TimeAsk } from "../../src/components/time-ask";
import {
  ApiError,
  getVessel,
  getVesselEvents,
  getVesselVersion,
  setCompartmentActive,
} from "../../src/api";
import { readVessel, writeVessel } from "../../src/cache";
import {
  enqueue,
  forVessel,
  readQueue,
  subscribe,
  type QueuedChange,
} from "../../src/queue";
import { overlayPending } from "../../src/sync";
import { useSession } from "../../src/session";
import { Banner } from "../../src/components/ui";
import { TransposedGrid } from "../../src/components/transposed-grid";
import { SyncStrip, type SyncState } from "../../src/components/sync-strip";
import { VesselHeader } from "../../src/components/vessel-header";
import { ActivityLog } from "../../src/components/activity-log";
import { colors, radius, space, TAP } from "../../src/theme";
import {
  CELL_STYLE,
  clampTime,
  formatWorkTime,
  isFinalStage,
  timeBounds,
  vesselTimeWindow,
  wallNow,
  nextStatusOnTap,
  progressOf,
  statusesOf,
  type CellStatus,
  type CellEvent,
  type TimeKind,
  type VesselDetail,
} from "../../src/types";

/**
 * The status sheet, on a phone.
 *
 * This is the screen the whole app exists for. Everything happens on the one
 * grid: tap a cell to move a stage on, hold a cell for N/A, and tap a hold's
 * header to mark crew as working in it.
 *
 * Every tap is written to the device queue before anything else. See src/queue.
 */

export default function Vessel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vesselId = Number(id);
  const { token, user, signOut } = useSession();
  const navigation = useNavigation();

  const [vessel, setVessel] = useState<VesselDetail | null>(null);
  const [pending, setPending] = useState<QueuedChange[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  /* How many of this vessel's taps were on the device last time we looked —
     a drop means the sync landed and the server now has them. */
  const pendingCount = useRef(0);

  /* The log is fetched only when opened. It is up to 200 rows and a supervisor
     on a metered connection should not pay for it on every screen load. */
  const [showLog, setShowLog] = useState(false);
  const [events, setEvents] = useState<CellEvent[]>([]);
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  /* Read inside the queue subscription, which must not resubscribe every time
     the panel is toggled. */
  const showLogRef = useRef(false);

  /* The newest event this phone has already accounted for. Notices are raised
     only for what came after it, and only for what someone else did — a
     supervisor does not need telling about their own taps. */
  const seenEventId = useRef<number | null>(null);
  const [notice, setNotice] = useState<CellEvent | null>(null);

  /* Crew presence is toggled from a hold's header on the grid. One busy flag
     is enough: a second tap while a save is in flight is ignored. */
  const [crewBusy, setCrewBusy] = useState(false);
  const [crewError, setCrewError] = useState<string | null>(null);

  const toggleCrew = useCallback(
    async (compartmentId: number, active: boolean) => {
      if (!token || !Number.isInteger(vesselId)) return;
      setCrewError(null);
      setCrewBusy(true);
      /* Optimistic, same as every other tap on this screen — the difference
         is what happens on failure: there is no queue behind this one, so a
         failure has to say so rather than sit quietly and look saved. */
      setVessel((v) =>
        v
          ? {
              ...v,
              compartments: v.compartments.map((c) =>
                c.id === compartmentId ? { ...c, active: active ? 1 : 0 } : c,
              ),
            }
          : v,
      );
      try {
        await setCompartmentActive(token, vesselId, compartmentId, active);
      } catch (err) {
        setVessel((v) =>
          v
            ? {
                ...v,
                compartments: v.compartments.map((c) =>
                  c.id === compartmentId ? { ...c, active: active ? 0 : 1 } : c,
                ),
              }
            : v,
        );
        setCrewError(
          err instanceof ApiError && err.isTransient
            ? "No connection — this needs signal. Try again once you have it."
            : "Could not save. Try again.",
        );
      } finally {
        setCrewBusy(false);
      }
    },
    [token, vesselId],
  );

  const refreshPending = useCallback(async () => {
    const queue = await readQueue();
    const mine = forVessel(queue, vesselId);
    pendingCount.current = mine.length;
    setPending(mine);
  }, [vesselId]);

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
              ? "No connection. Showing the last update from this phone — your taps are still saved."
              : "Could not load this vessel.",
        );
      }
    },
    [token, vesselId, signOut],
  );

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

  useEffect(() => {
    if (vessel) navigation.setOptions({ title: vessel.name });
  }, [vessel, navigation]);

  const loadEvents = useCallback(async () => {
    if (!token || !Number.isInteger(vesselId)) return;
    setLogLoading(true);
    setLogError(null);
    try {
      setEvents(await getVesselEvents(token, vesselId));
    } catch (err) {
      setLogError(
        err instanceof ApiError && err.isTransient
          ? "No connection. The log lives on the server, so it needs signal."
          : "Could not load the activity log.",
      );
    } finally {
      setLogLoading(false);
    }
  }, [token, vesselId]);

  useEffect(() => {
    showLogRef.current = showLog;
    if (showLog) void loadEvents();
  }, [showLog, loadEvents]);

  /**
   * Follows the queue, and refetches the moment it drains.
   *
   * The overlay is the only thing showing a tap that has not reached the
   * server. When the sync succeeds the entry is dropped from the queue — and
   * without this, the screen falls back to whatever the server said when the
   * page was opened, which is the tap undone. A supervisor watched a finished
   * hold turn green, then go blank when they moved to the next stage.
   *
   * So: mirror the queue, and when it shrinks, go and get the copy that now
   * has the change in it.
   */
  useEffect(() => {
    const unsubscribe = subscribe((queue) => {
      const mine = forVessel(queue, vesselId);
      const drained = mine.length < pendingCount.current;
      pendingCount.current = mine.length;
      setPending(mine);
      if (drained) {
        void load();
        /* The grid is about to show the server's copy; the log beside it
           would otherwise still be showing the state before the sync. */
        if (showLogRef.current) void loadEvents();
      }
    });
    return unsubscribe;
  }, [vesselId, load, loadEvents]);


  /**
   * Watches for changes made somewhere other than this phone.
   *
   * The office can mark a stage N/A, correct a time, or leave an instruction
   * on a hold, and until now the supervisor would only find out by pulling to
   * refresh. Version is polled because it is a cheap read; the log is only
   * fetched when that version actually moves.
   *
   * Paused while the app is backgrounded — a phone in a pocket for a night
   * shift should not poll several hundred times.
   */
  useEffect(() => {
    if (!token || !Number.isInteger(vesselId)) return;
    let cancelled = false;
    let lastVersion: number | null = null;

    const check = async () => {
      if (AppState.currentState !== "active") return;
      try {
        const { version } = await getVesselVersion(token, vesselId);
        if (cancelled) return;
        if (lastVersion !== null && version <= lastVersion) return;
        const first = lastVersion === null;
        lastVersion = version;

        const fresh = await getVesselEvents(token, vesselId);
        if (cancelled) return;
        setEvents(fresh);

        const newest = fresh[0]?.id ?? 0;
        /* On the first pass we are only establishing where "now" is; raising
           a notice for history the supervisor has already seen would be noise
           every time they open a vessel. */
        if (first) {
          seenEventId.current = newest;
          return;
        }
        const since = seenEventId.current ?? 0;
        const theirs = fresh.filter(
          (e) => e.id > since && e.userName !== (user?.name ?? ""),
        );
        seenEventId.current = newest;
        if (theirs.length > 0) {
          setNotice(theirs[0]);
          void load();
        }
      } catch {
        /* Offline. The sync strip already says so; a second complaint here
           would be the app crying wolf about something it cannot fix. */
      }
    };

    void check();
    const timer = setInterval(check, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [token, vesselId, user?.name, load]);

  /* What the supervisor is looking at: the server's picture with their own
     un-synced taps laid on top, so nothing they did appears to undo itself. */
  const compartments = useMemo(
    () => (vessel ? overlayPending(vessel.compartments, pending) : []),
    [vessel, pending],
  );

  /* The window a time on this vessel may fall in. Shared with the time sheet
     — see vesselTimeWindow in src/types for why it is bounded at all. */
  const timeWindow = useMemo(() => vesselTimeWindow(vessel), [vessel]);

  const overall = useMemo(() => {
    if (!vessel) return { done: 0, total: 0, ratio: 0 };
    return progressOf(
      compartments.flatMap((c) => statusesOf(c.cells, vessel.stages)),
    );
  }, [compartments, vessel]);

  /* Which cells still have a tap on this device, keyed the way the grid reads
     them so drawing the pip costs a set lookup rather than a scan per cell. */
  const queuedIds = useMemo(
    () => new Set(pending.map((p) => `${p.compartmentId}:${p.stageKey}`)),
    [pending],
  );

  /* Sent at least once and come back: the cell keeps its recorded status and
     takes a rule underneath, rather than being repainted as though the tap
     never happened. */
  const failedIds = useMemo(
    () =>
      new Set(
        pending
          .filter((p) => p.attempts > 0)
          .map((p) => `${p.compartmentId}:${p.stageKey}`),
      ),
    [pending],
  );

  /**
   * One of four states, derived rather than tracked.
   *
   * `attempts > 0` is the tell for failed: the entry has been sent and come
   * back at least once, which is different from never having been tried.
   */
  const syncState: SyncState = useMemo(() => {
    if (pending.length === 0) return "synced";
    if (pending.some((p) => p.attempts > 0)) return "failed";
    return stale ? "queued" : "syncing";
  }, [pending, stale]);

  const setCell = useCallback(
    async (
      compartmentId: number,
      stageKey: string,
      status: CellStatus,
      note?: string | null,
      times?: { startedAt?: string | null; completedAt?: string | null },
    ) => {
      const queue = await enqueue({
        vesselId,
        compartmentId,
        stageKey,
        status,
        note,
        ...(times ?? {}),
      });
      setPending(forVessel(queue, vesselId));
    },
    [vesselId],
  );

  /**
   * A status change waiting on the supervisor to confirm when it happened.
   *
   * Marking a stage as working or done asks for the time rather than assuming
   * "now". On a deck the tap and the work are often hours apart — a hold
   * finished at 02:10 gets entered when someone next has a free hand — and a
   * silently assumed time is a wrong time nobody notices until an invoice is
   * disputed.
   */
  const [askTime, setAskTime] = useState<{
    compartmentId: number;
    stageKey: string;
    stageLabel: string;
    status: CellStatus;
    /** Pre-fills the picker: the existing time, else now. */
    initial: Date;
    /** Narrowed per request — see requestStatus. */
    min: Date;
    max: Date;
  } | null>(null);

  /**
   * The entry point for every status tap.
   *
   * `pending` and `na` clear the times outright, so there is nothing to ask
   * about and prompting would be pure friction. The other two carry a time.
   */
  /** The cell behind a tap, for the times that bound the one being asked for. */
  const cellFor = useCallback(
    (compartmentId: number, stageKey: string) =>
      compartments.find((c) => c.id === compartmentId)?.cells[stageKey],
    [compartments],
  );

  const requestStatus = useCallback(
    (
      compartmentId: number,
      stageKey: string,
      stageLabel: string,
      status: CellStatus,
      existing?: string | null,
      /** The cell's OTHER time, which bounds this one. */
      counterpart?: string | null,
    ) => {
      if (status !== "in_progress" && status !== "done") {
        void setCell(compartmentId, stageKey, status);
        return;
      }

      /* Narrow the window so an impossible time cannot be picked at all — a
         finish cannot precede its start, and a start cannot follow its
         finish. The rule lives in timeBounds because the time sheet corrects
         the same times and must offer the same range; two copies of it would
         eventually disagree, and the one that is wrong hands the supervisor a
         time the API then refuses. */
      const kind: TimeKind = status === "in_progress" ? "started" : "finished";
      const bounds = timeBounds(kind, timeWindow, counterpart);

      setAskTime({
        compartmentId,
        stageKey,
        stageLabel,
        status,
        initial: clampTime(existing ? new Date(existing) : wallNow(), bounds),
        min: bounds.min,
        max: bounds.max,
      });
    },
    [setCell, timeWindow],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([load(), refreshPending()]);
    setRefreshing(false);
  }, [load, refreshPending]);

  if (!vessel) {
    return (
      <View style={styles.centre}>
        {error ? (
          <View style={{ padding: space.lg, width: "100%" }}>
            <Banner tone="error">{error}</Banner>
          </View>
        ) : (
          <>
            <ActivityIndicator size="large" color={colors.navy} />
            <Text style={styles.waiting}>Loading the status sheet…</Text>
          </>
        )}
      </View>
    );
  }


  return (
    /* The note fields sit well down the page, and without this the keyboard
       covers the very field being typed into. `padding` on iOS and `height` on
       Android are the two that actually resize the scroll area rather than
       sliding the whole screen out of view. `automaticallyAdjustKeyboardInsets`
       keeps the focused input above the keyboard as it opens. */
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {error && (
        <View style={{ marginBottom: space.md }}>
          <Banner tone={stale ? "warn" : "error"}>{error}</Banner>
        </View>
      )}

      {/* Navy bar then the sync strip, joined as one block: which vessel,
          and whether the phone is holding anything the server has not got. */}
      {/* Raised only for a change made somewhere other than this phone. It
          names the hold and the stage, because "the vessel was updated" is not
          something a supervisor can act on. */}
      {notice && (
        <Pressable
          onPress={() => {
            setNotice(null);
            setShowLog(true);
          }}
          style={styles.notice}
          accessibilityRole="button"
          accessibilityLabel="New update from the office. Open the activity log."
        >
          <Text style={styles.noticeLabel}>NEW UPDATE FROM THE OFFICE</Text>
          <Text style={styles.noticeText}>
            {notice.compartmentLabel} · {notice.stageLabel} →{" "}
            {CELL_STYLE[notice.toStatus].label}
            {notice.note ? ` — “${notice.note}”` : ""}
          </Text>
          <Text style={styles.noticeWho}>
            {notice.userName} · {formatWorkTime(notice.occurredAt)} · tap to see
            the log
          </Text>
        </Pressable>
      )}

      <View style={styles.headBlock}>
        <VesselHeader
          name={vessel.name}
          imo={vessel.imo}
          port={vessel.port}
          berth={vessel.berth}
          destination={vessel.destination}
          percent={Math.round(overall.ratio * 100)}
        />
        <SyncStrip
          state={syncState}
          queued={pending.length}
          onRetry={() => void onRefresh()}
        />
      </View>

      {vessel.notes ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{vessel.notes}</Text>
        </View>
      ) : null}

      {/* Asked for on every status tap that carries a time.
          Pre-filled with now, so the ordinary case — recording work as it
          happens — is a single confirm. Capped at now, because a stage cannot
          have started or finished in the future. Dismissing changes nothing:
          a cancelled time means the tap was a mistake, and applying the status
          anyway would leave a status the supervisor did not agree to. */}
      <TimeAsk
        visible={askTime !== null}
        title={askTime?.stageLabel ?? ""}
        kind={askTime?.status === "in_progress" ? "started" : "finished"}
        initial={askTime?.initial ?? wallNow()}
        minDate={askTime?.min ?? timeWindow.min}
        maxDate={askTime?.max ?? timeWindow.max}
        onCancel={() => setAskTime(null)}
        onConfirm={(date) => {
          const request = askTime;
          setAskTime(null);
          if (!request) return;
          void setCell(
            request.compartmentId,
            request.stageKey,
            request.status,
            undefined,
            request.status === "in_progress"
              ? { startedAt: date.toISOString() }
              : { completedAt: date.toISOString() },
          );
        }}
      />

      {/* The whole vessel on one grid. Tapping a hold's header marks crew as
          working in that hold (and tapping again clears it); stage cells are
          tapped directly. There is no per-hold screen any more. */}
      {crewError ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone="error">{crewError}</Banner>
        </View>
      ) : null}

      <TransposedGrid
        compartments={compartments}
        stages={vessel.stages}
        queuedIds={queuedIds}
        failedIds={failedIds}
        onTapCell={(compartmentId, stage, current) => {
          const next = nextStatusOnTap(
            current,
            isFinalStage(stage, vessel.stages),
          );
          /* Moving to working or done carries a time, so it goes through the
             ask; moving back to blank is a correction and carries none. */
          if (next === "pending") {
            void setCell(compartmentId, stage.key, next);
            return;
          }
          const cell = cellFor(compartmentId, stage.key);
          requestStatus(
            compartmentId,
            stage.key,
            stage.label,
            next,
            next === "in_progress" ? cell?.startedAt : cell?.completedAt,
            /* A finish cannot precede its start: passing the start here is
               what stops a supervisor picking a time before the work began,
               and narrows the day row to match. */
            next === "done" ? cell?.startedAt : cell?.completedAt,
          );
        }}
        onHoldCell={(compartmentId, stage) =>
          void setCell(compartmentId, stage.key, "na")
        }
        onToggleCrew={(compartmentId, active) => {
          if (crewBusy) return;
          void toggleCrew(compartmentId, active);
        }}
      />

      {/* The audit trail. Folded away by default: it answers "what did the
          last shift do" and "what time is this actually on record as", which
          are questions asked occasionally rather than continuously. */}
      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <Pressable
          onPress={() => setShowLog((v) => !v)}
          style={styles.backRow}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>
            {showLog ? "Hide activity" : "Activity on this vessel"}
          </Text>
        </Pressable>
        {showLog && (
          <ActivityLog events={events} loading={logLoading} error={logError} />
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space.lg, paddingBottom: space.xl * 2, gap: space.md },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    gap: space.md,
  },
  waiting: { color: colors.muted, fontSize: 14 },
  noteBox: {
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: { fontSize: 13, color: colors.text, lineHeight: 19 },
  headBlock: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.lg,
  },
  notice: {
    backgroundColor: colors.blueWash,
    borderWidth: 1,
    borderColor: colors.aqua,
    borderLeftWidth: 3,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    marginBottom: space.md,
    gap: 4,
  },
  noticeLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.aquaDark,
  },
  noticeText: { fontSize: 15, color: colors.text, lineHeight: 20 },
  noticeWho: { fontSize: 12, color: colors.muted },
  backRow: { minHeight: TAP, justifyContent: "center", paddingHorizontal: space.xs },
  backText: { fontSize: 15, fontWeight: "600", color: colors.blue },
});
