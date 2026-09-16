import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "../theme";
import {
  CELL_STYLE,
  formatDuration,
  workDateTime,
  type CellStatus,
  type CompartmentDetail,
  type Stage,
  type TimeKind,
} from "../types";

/**
 * Every recorded time on one vessel, on one sheet.
 *
 * The layout is the paper time sheet the office already keeps: holds down the
 * left, each split into a Start row and a Comp row, and one column per stage.
 * It is deliberately NOT the status grid turned into times — a supervisor
 * checking a shift's figures, or an office correcting them before invoicing,
 * reads down a column ("when did HP washing finish on every hold?") and across
 * a pair of rows ("how long did hold 3 take on each stage?"). Both of those
 * are one glance here and six taps on the status screen.
 *
 * As on the status grid, the label columns are pinned and the stage columns
 * scroll: a sheet that scrolls away the hold you are reading is worse than one
 * that does not scroll at all. Row heights are fixed rather than intrinsic
 * because the pinned block and the scrolling block are separate view trees —
 * if either sized itself to its own content the two would drift apart and the
 * times would stop lining up with their holds.
 */

const HOLD_W = 58;
const KIND_W = 64;
/* Wide enough for "14 Sep" over "16:00" at a size readable in weather. */
const CELL_W = 78;
const HEAD_H = 46;
const ROW_H = 44;

/** Which of a hold's two rows a cell sits on. */
const ROWS: { kind: TimeKind; label: string }[] = [
  { kind: "started", label: "Start" },
  { kind: "finished", label: "Comp" },
];

type Props = {
  compartments: CompartmentDetail[];
  stages: Stage[];
  /**
   * `compartmentId:stageKey:kind` for edits still on the device.
   *
   * Keyed by kind as well as cell, unlike the status grid's set: one cell is
   * two squares here, and marking both because the start was corrected puts a
   * "waiting to sync" pip on a finish nobody touched.
   */
  queuedTimes: Set<string>;
  /** Same key shape, for edits that have been sent and come back failed. */
  failedTimes?: Set<string>;
  onTapCell: (compartment: CompartmentDetail, stage: Stage, kind: TimeKind) => void;
};

export function TimeSheet({
  compartments,
  stages,
  queuedTimes,
  failedTimes,
  onTapCell,
}: Props) {
  return (
    <View>
      <View style={styles.frame}>
        <View style={styles.split}>
          {/* Pinned: which hold, and which of its two times. */}
          <View>
            <View style={[styles.headRow, { height: HEAD_H }]}>
              <View style={[styles.headCell, { width: HOLD_W }]}>
                <Text style={styles.axisLabel} numberOfLines={1}>
                  HOLD
                </Text>
              </View>
              <View style={[styles.headCell, { width: KIND_W }]}>
                <Text style={styles.axisLabel} numberOfLines={1}>
                  STAGES
                </Text>
              </View>
            </View>

            {compartments.map((c) => (
              <View key={c.id} style={[styles.row, styles.blockTop]}>
                <View
                  style={[
                    styles.holdCell,
                    { width: HOLD_W, height: ROW_H * ROWS.length },
                  ]}
                >
                  <Text style={styles.holdLabel} numberOfLines={2}>
                    {c.label}
                  </Text>
                </View>
                <View>
                  {ROWS.map(({ kind, label }) => (
                    <View
                      key={kind}
                      style={[
                        styles.kindCell,
                        { width: KIND_W, height: ROW_H },
                        {
                          borderLeftColor:
                            kind === "started"
                              ? CELL_STYLE.in_progress.border
                              : CELL_STYLE.done.border,
                        },
                      ]}
                    >
                      <Text style={styles.kindLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Scrolling: one column per stage, however many the vessel has. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View>
              <View style={[styles.headRow, { height: HEAD_H }]}>
                {stages.map((stage) => (
                  <View
                    key={stage.key}
                    style={[styles.stageHead, { width: CELL_W }]}
                  >
                    <Text style={styles.stageHeadLabel} numberOfLines={1}>
                      {stage.short.toUpperCase() || stage.label.toUpperCase()}
                    </Text>
                    <Text style={styles.stageHeadFull} numberOfLines={1}>
                      {stage.label}
                    </Text>
                  </View>
                ))}
              </View>

              {compartments.map((c) => (
                <View key={c.id} style={styles.blockTop}>
                  {ROWS.map(({ kind }) => (
                    <View key={kind} style={styles.row}>
                      {stages.map((stage) => {
                        const cell = c.cells[stage.key];
                        const id = `${c.id}:${stage.key}:${kind}`;
                        return (
                          <TimeCell
                            key={stage.key}
                            holdLabel={c.label}
                            stageLabel={stage.label}
                            kind={kind}
                            status={cell?.status ?? "pending"}
                            value={
                              kind === "started"
                                ? (cell?.startedAt ?? null)
                                : (cell?.completedAt ?? null)
                            }
                            duration={
                              kind === "finished"
                                ? formatDuration(cell?.startedAt, cell?.completedAt)
                                : null
                            }
                            queued={queuedTimes.has(id)}
                            failed={failedTimes?.has(id) ?? false}
                            onPress={() => onTapCell(c, stage, kind)}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.hintBox}>
        <Text style={styles.hint}>
          Tap any square to set or correct its time.
        </Text>
        <Text style={styles.rule}>
          A FINISH MUST COME AFTER ITS START · N/A STAGES ARE SET ON THE STATUS
          SHEET
        </Text>
      </View>
    </View>
  );
}

/**
 * One recorded time.
 *
 * A filled cell is white with the date over the clock, both lines always —
 * "16:00" alone is genuinely ambiguous on a job running past midnight, and
 * that ambiguity is what an invoice dispute turns on. An empty one is washed
 * grey, so a gap in the record is visible down a column without reading a
 * single figure. N/A is not a gap and is not editable: the office ruled that
 * stage out, and reviving it silently from a time picker is not a correction.
 */
function TimeCell({
  holdLabel,
  stageLabel,
  kind,
  status,
  value,
  duration,
  queued,
  failed,
  onPress,
}: {
  holdLabel: string;
  stageLabel: string;
  kind: TimeKind;
  status: CellStatus;
  value: string | null;
  /** Shown under a finish time, so a stage's length reads without arithmetic. */
  duration: string | null;
  queued: boolean;
  failed: boolean;
  onPress: () => void;
}) {
  const parts = workDateTime(value);
  const na = status === "na";
  const word = kind === "started" ? "start" : "finish";

  if (na) {
    return (
      <View
        style={[
          styles.cell,
          styles.cellNa,
          { width: CELL_W, height: ROW_H },
        ]}
        accessibilityLabel={`${holdLabel}, ${stageLabel}, not applicable`}
      >
        <Text style={styles.naText}>N/A</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        { width: CELL_W, height: ROW_H },
        parts ? styles.cellFilled : styles.cellEmpty,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        parts
          ? `${holdLabel}, ${stageLabel} ${word} ${parts.date} at ${parts.clock}. Tap to correct.`
          : `${holdLabel}, ${stageLabel} ${word} not recorded. Tap to set.`
      }
    >
      {parts ? (
        <>
          <Text style={styles.cellDate} numberOfLines={1}>
            {parts.date}
          </Text>
          <Text style={styles.cellClock} numberOfLines={1}>
            {parts.clock}
          </Text>
          {duration ? (
            <Text style={styles.cellDuration} numberOfLines={1}>
              {duration}
            </Text>
          ) : null}
        </>
      ) : (
        <Text style={styles.cellBlank}>—</Text>
      )}

      {/* Queued: a 7px square in the corner, not a banner. The edit is already
          safe on the device; this only says it has not reached the server. */}
      {queued && !failed ? <View style={styles.queuedPip} /> : null}
      {/* Failed keeps the figure the supervisor recorded and takes a rule
          underneath — the value is still what they meant, it just has not
          landed. Repainting it would read as the app losing their work. */}
      {failed ? <View style={styles.failedRule} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  split: { flexDirection: "row" },
  row: { flexDirection: "row" },

  /* Each hold is one block on the paper sheet, ruled off from the next. */
  blockTop: { borderTopWidth: 2, borderTopColor: colors.text },

  headRow: { flexDirection: "row", backgroundColor: colors.navy },
  headCell: {
    justifyContent: "flex-end",
    paddingHorizontal: space.sm,
    paddingBottom: space.sm,
    backgroundColor: colors.navy,
  },
  axisLabel: {
    fontSize: 9,
    letterSpacing: 1.1,
    color: colors.onDarkMuted,
    fontWeight: "700",
  },
  stageHead: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 4,
    paddingBottom: space.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.navyLine,
    backgroundColor: colors.navy,
  },
  stageHeadLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.onDark,
    letterSpacing: 0.6,
  },
  stageHeadFull: {
    fontSize: 8,
    color: colors.aquaTint,
    marginTop: 2,
    letterSpacing: 0.3,
  },

  holdCell: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.bg,
  },
  holdLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    lineHeight: 16,
  },

  kindCell: {
    justifyContent: "center",
    paddingLeft: space.sm,
    /* The one flash of colour in the sheet: the start row carries the yellow
       of a stage under way, the finish row the green of a finished one — the
       same language the status grid and the time picker already use. */
    borderLeftWidth: 3,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  kindLabel: { fontSize: 12, fontWeight: "700", color: colors.textBody },

  cell: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
  },
  cellFilled: { backgroundColor: colors.card },
  cellEmpty: { backgroundColor: colors.bg },
  cellNa: { backgroundColor: CELL_STYLE.na.bg },
  naText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: CELL_STYLE.na.text,
  },
  cellDate: { fontSize: 11, color: colors.muted, fontVariant: ["tabular-nums"] },
  cellClock: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    fontVariant: ["tabular-nums"],
    lineHeight: 18,
  },
  cellDuration: {
    fontSize: 9,
    color: colors.aquaDark,
    fontVariant: ["tabular-nums"],
  },
  cellBlank: { fontSize: 16, color: colors.borderStrong },

  queuedPip: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    backgroundColor: colors.navy,
  },
  failedRule: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: colors.danger,
  },

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
  rule: {
    marginTop: space.xs,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.faint,
    lineHeight: 15,
  },
});
