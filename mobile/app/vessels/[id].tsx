import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { TimeAsk } from "../../src/components/time-ask";
import { ApiError, getVessel } from "../../src/api";
import { readVessel, writeVessel } from "../../src/cache";
import { enqueue, forVessel, readQueue, type QueuedChange } from "../../src/queue";
import { overlayPending } from "../../src/sync";
import { useSession } from "../../src/session";
import { Banner, Card, ProgressBar } from "../../src/components/ui";
import { colors, radius, space, TAP } from "../../src/theme";
import {
  CELL_STATUSES,
  CELL_STYLE,
  compartmentNoun,
  compartmentState,
  formatDuration,
  formatWorkTime,
  nextStatusOnTap,
  progressOf,
  statusesOf,
  type CellStatus,
  type CompartmentDetail,
  type Stage,
  type VesselDetail,
} from "../../src/types";

/**
 * The status sheet, on a phone.
 *
 * This is the screen the whole app exists for. Two ways to record the same
 * thing, because the two situations are different:
 *
 *   · Tapping a stage chip cycles it — blank, working, done. That is the fast
 *     path, one thumb, no reading, which is what happens while the work is
 *     going on.
 *   · Expanding a hold gives every state spelled out, including "N/A", plus
 *     the note field. That is for the exceptions — a tank out of scope, water
 *     found in a hold — which are rare and worth slowing down for.
 *
 * Every tap is written to the device queue before anything else. See src/queue.
 */
export default function Vessel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vesselId = Number(id);
  const { token, signOut } = useSession();
  const navigation = useNavigation();

  const [vessel, setVessel] = useState<VesselDetail | null>(null);
  const [pending, setPending] = useState<QueuedChange[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refreshPending = useCallback(async () => {
    const queue = await readQueue();
    setPending(forVessel(queue, vesselId));
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

  /* What the supervisor is looking at: the server's picture with their own
     un-synced taps laid on top, so nothing they did appears to undo itself. */
  const compartments = useMemo(
    () => (vessel ? overlayPending(vessel.compartments, pending) : []),
    [vessel, pending],
  );

  /**
   * The window a time may fall in for this vessel.
   *
   * From the day the vessel came onto the books — its scheduled date, or when
   * the record was created if it was never scheduled — to two months later,
   * and never past now.
   *
   * Bounded because an open-ended date control on a deck is how a cleaning
   * record ends up dated 2019, and that only ever surfaces when someone is
   * arguing about an invoice. Two months is comfortably longer than any
   * turnaround while still ruling out a mistyped year.
   *
   * Both ends are capped at now so a vessel scheduled for next week cannot
   * produce a window that starts in the future.
   */
  const timeWindow = useMemo(() => {
    const now = new Date();
    const anchor = vessel
      ? new Date(vessel.scheduledFor ?? vessel.createdAt)
      : now;

    const twoMonthsOn = new Date(anchor);
    twoMonthsOn.setMonth(twoMonthsOn.getMonth() + 2);

    /* Start of the anchor DAY, not the instant the record was created — the
       whole of that day is inside the window, and a vessel added at 15:13
       should not refuse work recorded at 09:00 the same morning. */
    const min = new Date(Math.min(anchor.getTime(), now.getTime()));
    min.setHours(0, 0, 0, 0);
    const max = new Date(Math.min(twoMonthsOn.getTime(), now.getTime()));
    return { min, max: max.getTime() < min.getTime() ? new Date(min) : max };
  }, [vessel]);

  const overall = useMemo(() => {
    if (!vessel) return { done: 0, total: 0, ratio: 0 };
    return progressOf(
      compartments.flatMap((c) => statusesOf(c.cells, vessel.stages)),
    );
  }, [compartments, vessel]);

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
  } | null>(null);

  /**
   * The entry point for every status tap.
   *
   * `pending` and `na` clear the times outright, so there is nothing to ask
   * about and prompting would be pure friction. The other two carry a time.
   */
  const requestStatus = useCallback(
    (
      compartmentId: number,
      stageKey: string,
      stageLabel: string,
      status: CellStatus,
      existing?: string | null,
    ) => {
      if (status !== "in_progress" && status !== "done") {
        void setCell(compartmentId, stageKey, status);
        return;
      }
      setAskTime({
        compartmentId,
        stageKey,
        stageLabel,
        status,
        initial: existing ? new Date(existing) : new Date(),
      });
    },
    [setCell],
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

  const noun = compartmentNoun(vessel.type, true);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {error && (
        <View style={{ marginBottom: space.md }}>
          <Banner tone={stale ? "warn" : "error"}>{error}</Banner>
        </View>
      )}

      <Card style={{ padding: space.lg }}>
        <Text style={styles.reference}>{vessel.reference}</Text>
        <Text style={styles.name}>{vessel.name}</Text>
        <Text style={styles.where}>
          {vessel.port}
          {vessel.berth ? ` · ${vessel.berth}` : ""}
          {vessel.imo ? ` · IMO ${vessel.imo}` : ""}
        </Text>

        <View style={{ marginTop: space.lg }}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {noun} · {Math.round(overall.ratio * 100)}% complete
            </Text>
            <Text style={styles.percent}>
              {overall.done}/{overall.total}
            </Text>
          </View>
          <View style={{ marginTop: space.sm }}>
            <ProgressBar ratio={overall.ratio} />
          </View>
        </View>

        {vessel.notes ? (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{vessel.notes}</Text>
          </View>
        ) : null}
      </Card>

      <Text style={styles.hint}>
        Tap a stage to move it on. Open a {compartmentNoun(vessel.type).toLowerCase()}{" "}
        for N/A and notes.
      </Text>

      {/* Asked for on every status tap that carries a time.
          Pre-filled with now, so the ordinary case — recording work as it
          happens — is a single confirm. Capped at now, because a stage cannot
          have started or finished in the future. Dismissing changes nothing:
          a cancelled time means the tap was a mistake, and applying the status
          anyway would leave a status the supervisor did not agree to. */}
      <TimeAsk
        visible={askTime !== null}
        title={askTime?.stageLabel ?? ""}
        subtitle={
          askTime?.status === "in_progress"
            ? "When did this start?"
            : "When was this finished?"
        }
        initial={askTime?.initial ?? new Date()}
        minDate={timeWindow.min}
        maxDate={timeWindow.max}
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

      <View style={{ gap: space.md }}>
        {compartments.map((compartment) => (
          <CompartmentCard
            key={compartment.id}
            compartment={compartment}
            stages={vessel.stages}
            expanded={expanded === compartment.id}
            onToggleExpand={() =>
              setExpanded((current) =>
                current === compartment.id ? null : compartment.id,
              )
            }
            onSet={setCell}
            onRequestStatus={requestStatus}
            timeWindow={timeWindow}
          />
        ))}
      </View>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------- */

function CompartmentCard({
  compartment,
  stages,
  expanded,
  onToggleExpand,
  onSet,
  onRequestStatus,
  timeWindow,
}: {
  compartment: CompartmentDetail;
  stages: Stage[];
  expanded: boolean;
  onToggleExpand: () => void;
  onSet: (
    compartmentId: number,
    stageKey: string,
    status: CellStatus,
    note?: string | null,
    times?: { startedAt?: string | null; completedAt?: string | null },
  ) => void;
  /** Status taps go through here so the time can be confirmed first. */
  onRequestStatus: (
    compartmentId: number,
    stageKey: string,
    stageLabel: string,
    status: CellStatus,
    existing?: string | null,
  ) => void;
  /** The dates a time may fall in for this vessel. */
  timeWindow: { min: Date; max: Date };
}) {
  const statuses = statusesOf(compartment.cells, stages);
  const state = compartmentState(statuses);
  const { done, total } = progressOf(statuses);

  return (
    <Card>
      <Pressable
        onPress={onToggleExpand}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${compartment.label}, ${done} of ${total} stages done`}
        style={styles.compartmentHead}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.compartmentLabel}>{compartment.label}</Text>
          <Text style={styles.compartmentMeta}>
            {total === 0 ? "Not applicable" : `${done} of ${total} stages done`}
          </Text>
          {(compartment.startedAt || compartment.completedAt) && (
            <Text style={styles.compartmentTimes}>
              {compartment.startedAt
                ? `Started ${formatWorkTime(compartment.startedAt)}`
                : "Not started"}
              {compartment.completedAt
                ? ` · Finished ${formatWorkTime(compartment.completedAt)}`
                : ""}
              {formatDuration(compartment.startedAt, compartment.completedAt)
                ? ` · ${formatDuration(compartment.startedAt, compartment.completedAt)}`
                : ""}
            </Text>
          )}
        </View>
        <Text style={styles.disclosure}>{expanded ? "Close" : "Open"}</Text>
      </Pressable>

      {/* The fast path: the whole row of stages, one tap each. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {stages.map((stage) => {
          const cell = compartment.cells[stage.key];
          const status = cell?.status ?? "pending";
          const style = CELL_STYLE[status];
          return (
            <Pressable
              key={stage.key}
              onPress={() => {
                const next = nextStatusOnTap(status);
                onRequestStatus(
                  compartment.id,
                  stage.key,
                  stage.label,
                  next,
                  next === "in_progress" ? cell?.startedAt : cell?.completedAt,
                );
              }}
              accessibilityRole="button"
              accessibilityLabel={`${compartment.label}, ${stage.label}: ${style.label}. Tap to change.`}
              style={({ pressed }) => [
                styles.cell,
                { backgroundColor: style.bg, borderColor: style.border },
                pressed ? { opacity: 0.7 } : null,
              ]}
            >
              <Text style={[styles.cellStage, { color: style.text }]} numberOfLines={1}>
                {stage.short}
              </Text>
              <Text style={[styles.cellStatus, { color: style.text }]} numberOfLines={1}>
                {cell?.note ? cell.note : style.short || "—"}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {expanded && (
        <View style={styles.expanded}>
          {stages.map((stage) => (
            <StageRow
              key={stage.key}
              stage={stage}
              cell={compartment.cells[stage.key]}
              onSet={(status, note, times) =>
                onSet(compartment.id, stage.key, status, note, times)
              }
              timeWindow={timeWindow}
              onRequestStatus={(status, existing) =>
                onRequestStatus(
                  compartment.id,
                  stage.key,
                  stage.label,
                  status,
                  existing,
                )
              }
            />
          ))}
        </View>
      )}
    </Card>
  );
}

function StageRow({
  stage,
  cell,
  onSet,
  onRequestStatus,
  timeWindow,
}: {
  stage: Stage;
  cell:
    | {
        status: CellStatus;
        note: string | null;
        startedAt?: string | null;
        completedAt?: string | null;
      }
    | undefined;
  onSet: (
    status: CellStatus,
    note?: string | null,
    times?: { startedAt?: string | null; completedAt?: string | null },
  ) => void;
  /** Status taps, which ask for the time before applying anything. */
  onRequestStatus: (status: CellStatus, existing?: string | null) => void;
  timeWindow: { min: Date; max: Date };
}) {
  const status = cell?.status ?? "pending";
  const [draft, setDraft] = useState(cell?.note ?? "");
  /* Which field the picker is editing, if any. */
  const [picking, setPicking] = useState<"startedAt" | "completedAt" | null>(null);

  /* The note field is a controlled input that must follow the server when a
     refresh brings a newer value, but must not fight the person typing. */
  useEffect(() => {
    setDraft(cell?.note ?? "");
  }, [cell?.note]);

  return (
    <View style={styles.stageRow}>
      <Text style={styles.stageLabel}>{stage.label}</Text>

      <View style={styles.statusRow}>
        {CELL_STATUSES.map((option) => {
          const active = status === option;
          const style = CELL_STYLE[option];
          return (
            <Pressable
              key={option}
              onPress={() =>
                onRequestStatus(
                  option,
                  option === "in_progress"
                    ? cell?.startedAt
                    : option === "done"
                      ? cell?.completedAt
                      : null,
                )
              }
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${stage.label}: ${style.label}`}
              style={({ pressed }) => [
                styles.statusButton,
                active
                  ? { backgroundColor: style.bg, borderColor: style.border }
                  : { backgroundColor: "#fff", borderColor: colors.border },
                pressed ? { opacity: 0.7 } : null,
              ]}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  { color: active ? style.text : colors.muted },
                ]}
                numberOfLines={1}
              >
                {style.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Work times.
          Filled in automatically by the status buttons above — the common
          case is tapping when the work happens, where asking for a time would
          be friction for no gain. Tapping a time opens a picker, which is the
          correction path: work finished at 02:10 and entered at 06:00 should
          read 02:10, not 06:00. */}
      <View style={styles.timeRow}>
        <TimeField
          label="Started"
          value={cell?.startedAt ?? null}
          onPress={() => setPicking("startedAt")}
        />
        <TimeField
          label="Finished"
          value={cell?.completedAt ?? null}
          onPress={() => setPicking("completedAt")}
        />
        {formatDuration(cell?.startedAt, cell?.completedAt) && (
          <View style={styles.durationChip}>
            <Text style={styles.durationText}>
              {formatDuration(cell?.startedAt, cell?.completedAt)}
            </Text>
          </View>
        )}
      </View>

      <TimeAsk
        visible={picking !== null}
        title={stage.label}
        subtitle={picking === "startedAt" ? "Start time" : "Finish time"}
        initial={
          (picking === "startedAt" ? cell?.startedAt : cell?.completedAt)
            ? new Date(
                (picking === "startedAt"
                  ? cell?.startedAt
                  : cell?.completedAt) as string,
              )
            : new Date()
        }
        minDate={timeWindow.min}
        maxDate={timeWindow.max}
        onCancel={() => setPicking(null)}
        onConfirm={(date) => {
          const field = picking;
          setPicking(null);
          if (!field) return;
          onSet(status, undefined, { [field]: date.toISOString() });
        }}
      />

      <TextInput
        value={draft}
        onChangeText={setDraft}
        /* Saved on blur, not per keystroke — one queued change per note
           rather than one per letter typed on a flaky connection. */
        onBlur={() => {
          const next = draft.trim();
          if (next !== (cell?.note ?? "").trim()) onSet(status, next || null);
        }}
        maxLength={160}
        placeholder="Add a note — e.g. water in tank"
        placeholderTextColor={colors.faint}
        style={styles.noteInput}
      />
    </View>
  );
}

/**
 * One time, tappable to change it.
 *
 * Shown even when empty so the pair reads as a record with a gap in it, rather
 * than as a feature the supervisor has to go looking for.
 */
function TimeField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string | null;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${formatWorkTime(value)}. Tap to change.`}
      style={({ pressed }) => [styles.timeField, pressed && { opacity: 0.6 }]}
    >
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={[styles.timeValue, !value && styles.timeValueEmpty]}>
        {formatWorkTime(value)}
      </Text>
    </Pressable>
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
  reference: { fontSize: 12, color: colors.faint },
  name: { marginTop: 2, fontSize: 22, fontWeight: "800", color: colors.text },
  where: { marginTop: 4, fontSize: 14, color: colors.muted },
  progressRow: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  percent: { fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"] },
  noteBox: {
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radius.sm,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: { fontSize: 13, color: colors.text, lineHeight: 19 },
  hint: { fontSize: 13, color: colors.muted, paddingHorizontal: space.xs },
  compartmentHead: {
    flexDirection: "row",
    alignItems: "center",
    padding: space.lg,
    minHeight: TAP,
  },
  compartmentLabel: { fontSize: 17, fontWeight: "800", color: colors.text },
  compartmentMeta: { marginTop: 2, fontSize: 13, color: colors.muted },
  disclosure: { fontSize: 14, fontWeight: "700", color: colors.blue },
  strip: {
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    gap: space.sm,
  },
  cell: {
    minWidth: 84,
    minHeight: TAP,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    justifyContent: "center",
  },
  cellStage: { fontSize: 11, fontWeight: "700", opacity: 0.8 },
  cellStatus: { marginTop: 2, fontSize: 13, fontWeight: "700" },
  expanded: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stageRow: {
    padding: space.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: space.sm,
  },
  stageLabel: { fontSize: 15, fontWeight: "700", color: colors.text },
  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  statusButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    justifyContent: "center",
  },
  statusButtonText: { fontSize: 13, fontWeight: "700" },
  compartmentTimes: {
    marginTop: 3,
    fontSize: 12,
    color: colors.muted,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    flexWrap: "wrap",
  },
  timeField: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: "#fff",
    minWidth: 108,
  },
  timeLabel: { fontSize: 11, color: colors.muted, fontWeight: "600" },
  timeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  timeValueEmpty: { color: colors.faint, fontWeight: "500" },
  durationChip: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    backgroundColor: "#eff6ff",
  },
  durationText: { fontSize: 13, fontWeight: "700", color: "#1e40af" },
  noteInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    fontSize: 15,
    color: colors.text,
    backgroundColor: "#f8fafc",
  },
});
