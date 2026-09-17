import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Banner } from "../../src/components/ui";
import { SyncStrip } from "../../src/components/sync-strip";
import { TimeAsk } from "../../src/components/time-ask";
import { TimeLog } from "../../src/components/time-log";
import { useVessel } from "../../src/use-vessel";
import { colors, space } from "../../src/theme";
import {
  clampTime,
  compartmentNoun,
  statusForTimeEdit,
  timeBounds,
  wallNow,
  type CellStatus,
  type Stage,
  type TimeKind,
  type TimeWindow,
} from "../../src/types";

/**
 * The time log: every start and finish on one vessel, in one place.
 *
 * The status grid answers "where are we"; this answers "when". They are
 * different questions asked by different people at different moments — a
 * supervisor closing a shift, or the office checking figures before they go on
 * an invoice — and the status grid answers the second one badly: the times are
 * there, but one cell at a time, behind a tap each.
 *
 * Edits go through the same device queue as every other tap, so a correction
 * made at anchor with no signal is as safe as one made alongside.
 */
export default function VesselTimeLog() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vesselId = Number(id);
  const navigation = useNavigation();

  const {
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
  } = useVessel(vesselId);

  useEffect(() => {
    if (vessel) navigation.setOptions({ title: `${vessel.name} — time log` });
  }, [vessel, navigation]);

  /**
   * The cell waiting on a time.
   *
   * Carries the status the cell will end up with as well as the time, because
   * the API clears both times on a `pending` or `na` cell — so recording a
   * start on a blank stage has to move it to in-progress in the same change,
   * or the server would accept the write and drop the very figure that was
   * entered. See statusForTimeEdit.
   */
  const [ask, setAsk] = useState<{
    compartmentId: number;
    stageKey: string;
    title: string;
    kind: TimeKind;
    status: CellStatus;
    initial: Date;
    bounds: TimeWindow;
  } | null>(null);

  const onTapCell = useCallback(
    (
      compartment: { id: number; label: string; cells: Record<string, { status: CellStatus; startedAt: string | null; completedAt: string | null }> },
      stage: Stage,
      kind: TimeKind,
    ) => {
      const cell = compartment.cells[stage.key];
      const current = cell?.status ?? "pending";
      /* N/A cells are not tappable in the sheet; this is the guard for the
         case a cell changes underneath a press that is already in flight. */
      if (current === "na") return;

      const existing = kind === "started" ? cell?.startedAt : cell?.completedAt;
      /* The cell's OTHER time is what bounds this one — a finish cannot
         precede its start, and the picker should offer nothing that would be
         refused on arrival. */
      const counterpart = kind === "started" ? cell?.completedAt : cell?.startedAt;
      const bounds = timeBounds(kind, window, counterpart);

      setAsk({
        compartmentId: compartment.id,
        stageKey: stage.key,
        title: `${compartment.label} · ${stage.label}`,
        kind,
        status: statusForTimeEdit(kind, current),
        initial: clampTime(existing ? new Date(existing) : wallNow(), bounds),
        bounds,
      });
    },
    [window],
  );

  /**
   * Which individual squares are still on the device, and which have come
   * back refused.
   *
   * Built from the queue rather than taken from the hook's cell-level sets,
   * because a square here is one TIME, not one cell: a queued change carries
   * either a `startedAt` or a `completedAt`, and only the row it actually
   * touched should wear the pip.
   */
  const { queuedTimes, failedTimes } = useMemo(() => {
    const queued = new Set<string>();
    const failed = new Set<string>();
    for (const change of pending) {
      const base = `${change.compartmentId}:${change.stageKey}`;
      const kinds: TimeKind[] = [];
      if (change.startedAt !== undefined) kinds.push("started");
      if (change.completedAt !== undefined) kinds.push("finished");
      /* A change with no explicit time came from the status grid, where a tap
         derives one. Mark both squares — either could be the one that moves. */
      if (kinds.length === 0) kinds.push("started", "finished");
      for (const kind of kinds) {
        queued.add(`${base}:${kind}`);
        if (change.attempts > 0) failed.add(`${base}:${kind}`);
      }
    }
    return { queuedTimes: queued, failedTimes: failed };
  }, [pending]);

  const recorded = useMemo(() => {
    if (!vessel) return { filled: 0, total: 0 };
    let filled = 0;
    let total = 0;
    for (const c of compartments) {
      for (const stage of vessel.stages) {
        const cell = c.cells[stage.key];
        /* N/A stages are out of the denominator, exactly as they are in the
           progress arithmetic — a hold with a ruled-out stage is not missing
           a time, and counting it as missing would send someone looking for
           a figure that should not exist. */
        if (cell?.status === "na") continue;
        total += 2;
        if (cell?.startedAt) filled += 1;
        if (cell?.completedAt) filled += 1;
      }
    }
    return { filled, total };
  }, [compartments, vessel]);

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
            <Text style={styles.waiting}>Loading the time log…</Text>
          </>
        )}
      </View>
    );
  }

  const noun = compartmentNoun(vessel.type, true).toLowerCase();

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />
      }
    >
      {error ? (
        <View style={{ marginBottom: space.md }}>
          <Banner tone={stale ? "warn" : "error"}>{error}</Banner>
        </View>
      ) : null}

      <View style={styles.headBlock}>
        <View style={styles.head}>
          <Text style={styles.vessel} numberOfLines={1}>
            {vessel.name}
          </Text>
          <Text style={styles.where} numberOfLines={1}>
            {vessel.port}
            {vessel.berth ? ` · ${vessel.berth}` : ""} · {compartments.length}{" "}
            {noun}
          </Text>
          <Text style={styles.counted}>
            {recorded.filled} of {recorded.total} times recorded
          </Text>
        </View>
        <SyncStrip
          state={syncState}
          queued={pending.length}
          onRetry={() => void refresh()}
        />
      </View>

      <TimeAsk
        visible={ask !== null}
        title={ask?.title ?? ""}
        kind={ask?.kind ?? "started"}
        initial={ask?.initial ?? wallNow()}
        minDate={ask?.bounds.min ?? window.min}
        maxDate={ask?.bounds.max ?? window.max}
        onCancel={() => setAsk(null)}
        onConfirm={(date) => {
          const request = ask;
          setAsk(null);
          if (!request) return;
          void setCell(
            request.compartmentId,
            request.stageKey,
            request.status,
            request.kind === "started"
              ? { startedAt: date.toISOString() }
              : { completedAt: date.toISOString() },
          );
        }}
      />

      <TimeLog
        compartments={compartments}
        stages={vessel.stages}
        queuedTimes={queuedTimes}
        failedTimes={failedTimes}
        onTapCell={onTapCell}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space.lg, paddingBottom: space.xl * 2 },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    gap: space.md,
  },
  waiting: { color: colors.muted, fontSize: 14 },
  headBlock: {
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: space.lg,
  },
  head: {
    backgroundColor: colors.navy,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  vessel: { fontSize: 18, fontWeight: "800", color: colors.onDark },
  where: { marginTop: 2, fontSize: 12, color: colors.onDarkMuted },
  counted: {
    marginTop: space.sm,
    fontSize: 12,
    fontWeight: "700",
    color: colors.aquaTint,
    fontVariant: ["tabular-nums"],
  },
});
