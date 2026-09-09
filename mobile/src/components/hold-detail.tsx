import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "../theme";
import {
  CELL_STYLE,
  compartmentState,
  formatWorkTime,
  progressOf,
  statusesOf,
  type CellStatus,
  type CompartmentDetail,
  type Stage,
} from "../types";

/**
 * One hold, every stage spelled out.
 *
 * The grid is for reading the vessel; this is for working one hold. Each stage
 * is a full-width row rather than a cell, which is the point: a 44px cell has
 * to be aimed at, and a supervisor in gloves on a moving deck should not have
 * to aim. The row carries its own state as a fill, so the screen can be read
 * at arm's length without focusing on any of the text.
 *
 * Times are shown because they are the thing disputed later — "finished 02:52"
 * is the record, and a supervisor should be able to see what the phone thinks
 * happened without opening anything.
 */

type Props = {
  compartment: CompartmentDetail;
  stages: Stage[];
  onBack: () => void;
  onTapStage: (stage: Stage, current: CellStatus) => void;
  onHoldStage: (stage: Stage) => void;
};

const STATE_WORD: Record<string, string> = {
  complete: "COMPLETE",
  "in-progress": "WORKING",
  "not-started": "NOT STARTED",
};

export function HoldDetail({
  compartment,
  stages,
  onBack,
  onTapStage,
  onHoldStage,
}: Props) {
  const statuses = statusesOf(compartment.cells, stages);
  const progress = progressOf(statuses);
  const state = compartmentState(statuses);
  const pct = Math.round(progress.ratio * 100);

  return (
    <View>
      <View style={styles.head}>
        <Pressable
          onPress={onBack}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Back to the whole vessel"
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <View style={styles.headText}>
          <Text style={styles.holdName} numberOfLines={1}>
            {compartment.label.toUpperCase()}
          </Text>
          <Text style={styles.headMeta} numberOfLines={1}>
            {progress.done} OF {progress.total} STAGES DONE · {STATE_WORD[state]}
          </Text>
        </View>

        <Text style={styles.headPct}>{pct}%</Text>
      </View>

      {compartment.notes ? (
        <View style={styles.holdNote}>
          <Text style={styles.holdNoteLabel}>FROM THE OFFICE</Text>
          <Text style={styles.holdNoteText}>{compartment.notes}</Text>
        </View>
      ) : null}

      <View style={styles.rows}>
        {stages.map((stage) => {
          const cell = compartment.cells[stage.key];
          const status: CellStatus = cell?.status ?? "pending";
          const skin = CELL_STYLE[status];
          return (
            <Pressable
              key={stage.key}
              onPress={() => onTapStage(stage, status)}
              onLongPress={() => onHoldStage(stage)}
              delayLongPress={420}
              accessibilityRole="button"
              accessibilityLabel={`${stage.label}, ${skin.label}`}
              style={[styles.row, { backgroundColor: skin.bg }]}
            >
              {/* A stripe in the status's own border colour: the row reads as
                  its state even where the fill is nearly white. */}
              <View style={[styles.stripe, { backgroundColor: skin.border }]} />

              <View style={styles.rowText}>
                <Text style={[styles.stageName, { color: skin.text }]} numberOfLines={1}>
                  {stage.label}
                </Text>
                <Text style={[styles.stageMeta, { color: skin.text }]} numberOfLines={1}>
                  {subtitleFor(stage, status, cell)}
                </Text>
                {cell?.note ? (
                  <Text
                    style={[styles.stageNote, { color: skin.text }]}
                    numberOfLines={2}
                  >
                    “{cell.note}”
                  </Text>
                ) : null}
              </View>

              <Text style={[styles.rowStatus, { color: skin.text }]}>
                {(skin.short || skin.label).toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.hintBox}>
        <Text style={styles.hint}>Tap a stage to advance · press and hold to mark N/A</Text>
        <Text style={styles.rule}>WORKING COUNTS AS HALF A STAGE</Text>
      </View>
    </View>
  );
}

/** "DRY · FINISHED 02:52" — the short code, then whatever time is on record. */
function subtitleFor(
  stage: Stage,
  status: CellStatus,
  cell: CompartmentDetail["cells"][string] | undefined,
) {
  const code = stage.short.toUpperCase();
  if (status === "done" && cell?.completedAt) {
    return `${code} · FINISHED ${formatWorkTime(cell.completedAt)}`;
  }
  if (status === "in_progress" && cell?.startedAt) {
    return `${code} · SINCE ${formatWorkTime(cell.startedAt)}`;
  }
  if (status === "na") return `${code} · NOT APPLICABLE`;
  return `${code} · NOT STARTED`;
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: colors.navy,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  back: { color: colors.onDark, fontSize: 26, fontWeight: "700", marginRight: 2 },
  headText: { flex: 1, minWidth: 0 },
  holdName: { color: colors.onDark, fontSize: 23, fontWeight: "700", letterSpacing: 0.4 },
  headMeta: { color: colors.aquaTint, fontSize: 11, marginTop: 4, letterSpacing: 1 },
  headPct: { color: colors.aquaTint, fontSize: 27, fontWeight: "700" },

  rows: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: "hidden",
    gap: 2,
    backgroundColor: colors.border,
    paddingTop: 2,
  },
  row: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: space.lg,
  },
  stripe: { width: 5, alignSelf: "stretch" },
  rowText: { flex: 1, minWidth: 0, paddingLeft: space.lg },
  stageName: { fontSize: 18, fontWeight: "700" },
  stageMeta: { fontSize: 11, marginTop: 5, letterSpacing: 1, opacity: 0.85 },
  rowStatus: { fontSize: 14, fontWeight: "700", letterSpacing: 0.6 },
  stageNote: { fontSize: 12, marginTop: 5, fontStyle: "italic", opacity: 0.9 },

  /* The office's instruction for this hold. Aqua-ruled rather than coloured
     like a status, because it is information, not a state. */
  holdNote: {
    backgroundColor: colors.blueWash,
    borderLeftWidth: 3,
    borderLeftColor: colors.aqua,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginTop: 2,
  },
  holdNoteLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.aquaDark,
    marginBottom: 4,
  },
  holdNoteText: { fontSize: 14, color: colors.text, lineHeight: 19 },

  hintBox: {
    marginTop: space.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.blue,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  hint: { fontSize: 14, color: colors.text, fontWeight: "500" },
  rule: { marginTop: space.xs, fontSize: 10, letterSpacing: 0.8, color: colors.faint },
});
