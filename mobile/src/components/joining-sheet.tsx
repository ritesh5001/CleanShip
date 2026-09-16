import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, TAP } from "../theme";
import {
  DOCUMENT_STATE_STYLE,
  formatWorkTime,
  nextDocumentState,
  type ChecklistMap,
  type CrewItem,
  type CrewProgress,
  type DocumentMap,
  type DocumentState,
  type TravelMap,
  type TravelStep,
} from "../types";

/**
 * One person's joining paperwork.
 *
 * The printed sheet's column, turned on its side so it reads on a phone:
 * documents, then the checklist, then the travel chain. Three sections rather
 * than one list because they answer different questions and are filled in by
 * different people at different times — a joiner uploads their own documents
 * weeks out, a supervisor ticks the rope kit at the hotel, and the travel
 * times are tapped on the way to the gate.
 *
 * The same component serves both cases: a joiner working on their own row, and
 * a supervisor working on somebody else's. Nothing here knows which — it takes
 * the maps and three callbacks — so there is no chance of the two drifting
 * into different rules about what counts as done.
 */

type Props = {
  documents: CrewItem[];
  checklist: CrewItem[];
  travelSteps: TravelStep[];
  documentState: DocumentMap;
  checklistState: ChecklistMap;
  travelState: TravelMap;
  progress: CrewProgress;
  /** Set once the crew are aboard: the record is history and stops taking edits. */
  readOnly?: boolean;
  /** Saves in flight, so a double tap cannot race itself. */
  busyKey?: string | null;
  onDocument: (key: string, next: DocumentState) => void;
  onChecklist: (key: string, next: boolean) => void;
  /** A time, or null to clear the step. */
  onTravel: (key: string, next: string | null) => void;
};

export function JoiningSheet({
  documents,
  checklist,
  travelSteps,
  documentState,
  checklistState,
  travelState,
  progress,
  readOnly = false,
  busyKey,
  onDocument,
  onChecklist,
  onTravel,
}: Props) {
  return (
    <View style={{ gap: space.lg }}>
      <ReadinessStrip progress={progress} readOnly={readOnly} />

      {/* ---- Documents ---- */}
      <Section
        title="Documents"
        hint={
          readOnly
            ? undefined
            : "Tap to cycle: not done → done → expired"
        }
        count={`${progress.documentsDone}/${progress.documentsTotal}`}
      >
        {documents.length === 0 ? (
          <Blank>This vessel asks for no documents.</Blank>
        ) : (
          documents.map((item) => {
            const state = documentState[item.key] ?? "pending";
            const skin = DOCUMENT_STATE_STYLE[state];
            return (
              <Pressable
                key={item.key}
                disabled={readOnly || busyKey === item.key}
                onPress={() => onDocument(item.key, nextDocumentState(state))}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}, ${skin.label}${
                  readOnly ? "" : ". Tap to change."
                }`}
                style={({ pressed }) => [
                  styles.row,
                  pressed && !readOnly ? { opacity: 0.85 } : null,
                ]}
              >
                <Text style={styles.rowLabel} numberOfLines={2}>
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.state,
                    { backgroundColor: skin.bg, borderColor: skin.border },
                    busyKey === item.key ? { opacity: 0.5 } : null,
                  ]}
                >
                  <Text style={[styles.stateText, { color: skin.text }]}>
                    {skin.label}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </Section>

      {/* ---- Checklist ---- */}
      <Section
        title="Checklist"
        count={`${progress.checklistDone}/${progress.checklistTotal}`}
      >
        {checklist.length === 0 ? (
          <Blank>This vessel has no checklist.</Blank>
        ) : (
          checklist.map((item) => {
            const done = checklistState[item.key] === true;
            return (
              <Pressable
                key={item.key}
                disabled={readOnly || busyKey === item.key}
                onPress={() => onChecklist(item.key, !done)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: done, disabled: readOnly }}
                accessibilityLabel={item.label}
                style={({ pressed }) => [
                  styles.row,
                  pressed && !readOnly ? { opacity: 0.85 } : null,
                ]}
              >
                <Text style={styles.rowLabel} numberOfLines={3}>
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.box,
                    done ? styles.boxOn : null,
                    busyKey === item.key ? { opacity: 0.5 } : null,
                  ]}
                >
                  {done ? <Text style={styles.tick}>✓</Text> : null}
                </View>
              </Pressable>
            );
          })
        )}
      </Section>

      {/* ---- Travel ----
          A chain rather than a list of ticks: each step stamps the moment it
          happened, because the office chasing a late joiner needs 04:20 and
          not a tick. Tapping a recorded step clears it, which is the only
          honest way to fix one tapped by mistake. */}
      <Section
        title="Travel"
        hint={readOnly ? undefined : "Tap as it happens — the time is recorded"}
        count={`${progress.travelDone}/${progress.travelTotal}`}
      >
        {travelSteps.map((step, i) => {
          const at = travelState[step.key] ?? null;
          const done = Boolean(at);
          const last = i === travelSteps.length - 1;
          return (
            <Pressable
              key={step.key}
              disabled={readOnly || busyKey === step.key}
              onPress={() => onTravel(step.key, done ? null : new Date().toISOString())}
              accessibilityRole="button"
              accessibilityLabel={
                done
                  ? `${step.label} at ${formatWorkTime(at)}. Tap to clear.`
                  : `${step.label}, not recorded. Tap to stamp the time.`
              }
              style={({ pressed }) => [
                styles.travelRow,
                pressed && !readOnly ? { opacity: 0.85 } : null,
              ]}
            >
              {/* The rail: a filled dot for what has happened, hollow for what
                  has not, joined by a line so the sequence reads at a glance. */}
              <View style={styles.rail}>
                <View style={[styles.dot, done ? styles.dotOn : null]} />
                {!last ? (
                  <View style={[styles.railLine, done ? styles.railLineOn : null]} />
                ) : null}
              </View>
              <View style={styles.travelBody}>
                <Text
                  style={[styles.travelLabel, done ? styles.travelLabelOn : null]}
                  numberOfLines={2}
                >
                  {step.label}
                </Text>
                <Text style={styles.travelTime}>
                  {done ? formatWorkTime(at) : "—"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Section>
    </View>
  );
}

/**
 * The one line somebody actually reads.
 *
 * Green when the paperwork is complete, red the moment anything is expired —
 * an expired document is the thing that stops a joiner at the gate, and it
 * should not have to be found by scrolling.
 */
function ReadinessStrip({
  progress,
  readOnly,
}: {
  progress: CrewProgress;
  readOnly: boolean;
}) {
  const blocked = progress.documentsExpired > 0;
  const outstanding =
    progress.documentsTotal -
    progress.documentsDone -
    progress.documentsExpired +
    (progress.checklistTotal - progress.checklistDone);

  const tone = blocked
    ? { bg: "#fae5e0", border: colors.danger, text: colors.danger }
    : progress.ready
      ? { bg: "#e2f4ea", border: colors.ok, text: "#14400a" }
      : { bg: colors.warnBg, border: colors.warnBorder, text: colors.warn };

  return (
    <View
      style={[styles.readiness, { backgroundColor: tone.bg, borderColor: tone.border }]}
      accessibilityRole="summary"
    >
      <Text style={[styles.readinessText, { color: tone.text }]}>
        {blocked
          ? `${progress.documentsExpired} document${
              progress.documentsExpired === 1 ? "" : "s"
            } expired — this will stop you boarding`
          : progress.ready
            ? readOnly
              ? "Joining paperwork complete"
              : "All clear — paperwork complete"
            : `${outstanding} item${outstanding === 1 ? "" : "s"} still outstanding`}
      </Text>
    </View>
  );
}

function Section({
  title,
  hint,
  count,
  children,
}: {
  title: string;
  hint?: string;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{count}</Text>
      </View>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Blank({ children }: { children: React.ReactNode }) {
  return <Text style={styles.blank}>{children}</Text>;
}

const styles = StyleSheet.create({
  readiness: {
    borderWidth: 1,
    borderLeftWidth: 3,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  readinessText: { fontSize: 14, fontWeight: "700", lineHeight: 19 },

  sectionHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.faint,
    fontVariant: ["tabular-nums"],
  },
  sectionHint: { fontSize: 12, color: colors.faint, marginBottom: space.sm },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginTop: space.xs,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: TAP,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 20 },

  state: {
    minWidth: 78,
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stateText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },

  box: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOn: { backgroundColor: "#8fce6a", borderColor: "#4f9c2b" },
  tick: { fontSize: 17, fontWeight: "700", color: "#14400a", lineHeight: 20 },

  travelRow: {
    flexDirection: "row",
    minHeight: TAP,
    paddingHorizontal: space.md,
  },
  rail: { width: 22, alignItems: "center" },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    marginTop: 18,
  },
  dotOn: { backgroundColor: colors.aqua, borderColor: colors.aquaDark },
  railLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 2,
    marginBottom: -2,
  },
  railLineOn: { backgroundColor: colors.aqua },
  travelBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    paddingVertical: space.md,
    marginLeft: space.sm,
  },
  travelLabel: { flex: 1, fontSize: 15, color: colors.muted, lineHeight: 20 },
  travelLabelOn: { color: colors.text, fontWeight: "600" },
  travelTime: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },

  blank: {
    padding: space.md,
    fontSize: 14,
    color: colors.muted,
  },
});
