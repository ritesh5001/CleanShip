import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "../theme";
import {
  CELL_STYLE,
  progressOf,
  statusesOf,
  type CellStatus,
  type CompartmentDetail,
  type Stage,
} from "../types";

/**
 * The status sheet turned 90°.
 *
 * The paper sheet runs compartments down and stages across, which on a phone
 * means the axis that grows — up to nine holds or a tanker's many tanks — is
 * the one with no room. Turned, the axis that grows runs across the short side
 * and the one that is effectively fixed (there are always about six stages)
 * runs down.
 *
 * Past five or six compartments even the short side runs out, so the cells
 * scroll sideways while the stage column stays pinned. That is the important
 * part: a supervisor scrolling to hold 8 must still be able to see which row
 * is Bilges. A grid that scrolls its labels away is worse than one that does
 * not scroll at all.
 *
 * Row heights are fixed rather than intrinsic, because the pinned column and
 * the scrolling one are separate view trees — if either sized itself to its
 * own content the two would drift out of alignment and the ticks would stop
 * lining up with their stages.
 */

/* The design's floor is 44 × 58 — the smallest a gloved thumb hits reliably.
   These sit above it, since horizontal scrolling means width is no longer
   something the layout has to economise on. */
const LABEL_W = 104;
const CELL_W = 58;
const HEAD_H = 58;
const ROW_H = 62;

type Props = {
  compartments: CompartmentDetail[];
  stages: Stage[];
  /** `compartmentId:stageKey` for taps still on the device. */
  queuedIds: Set<string>;
  /** Same key shape, for taps that have been sent and come back failed. */
  failedIds?: Set<string>;
  onTapCell: (compartmentId: number, stage: Stage, current: CellStatus) => void;
  onHoldCell: (compartmentId: number, stage: Stage) => void;
  onOpenCompartment: (compartmentId: number) => void;
};

export function TransposedGrid({
  compartments,
  stages,
  queuedIds,
  failedIds,
  onTapCell,
  onHoldCell,
  onOpenCompartment,
}: Props) {
  return (
    <View>
      <View style={styles.frame}>
        <View style={styles.split}>
          {/* Pinned: the stage names, which must never scroll away. */}
          <View style={styles.labelCol}>
            <View style={[styles.stageHeadCell, { height: HEAD_H }]}>
              <Text style={styles.axisLabel}>STAGE</Text>
            </View>
            {stages.map((stage) => (
              <View key={stage.key} style={[styles.stageCell, { height: ROW_H }]}>
                <Text style={styles.stageLabel} numberOfLines={2}>
                  {stage.label}
                </Text>
                <Text style={styles.stageShort} numberOfLines={1}>
                  {stage.short.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Scrolling: one column per compartment, however many there are. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            /* Bounces so the edge of the last column is reachable even when
               the content ends flush with the screen. */
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View>
              <View style={styles.row}>
                {compartments.map((c) => {
                  const pct = Math.round(
                    progressOf(statusesOf(c.cells, stages)).ratio * 100,
                  );
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => onOpenCompartment(c.id)}
                      style={[styles.colHead, { width: CELL_W, height: HEAD_H }]}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${c.label}, ${pct} percent complete`}
                    >
                      <Text style={styles.colHeadLabel} numberOfLines={1}>
                        {shortLabel(c.label)}
                      </Text>
                      <Text style={styles.colHeadPct} numberOfLines={1}>
                        {pct}%
                      </Text>
                      {/* This hold carries an instruction from the office. */}
                      {c.notes ? <View style={styles.headNoteDot} /> : null}
                    </Pressable>
                  );
                })}
              </View>

              {stages.map((stage) => (
                <View key={stage.key} style={styles.row}>
                  {compartments.map((c) => {
                    const cell = c.cells[stage.key];
                    const status = cell?.status ?? "pending";
                    const skin = CELL_STYLE[status];
                    const id = `${c.id}:${stage.key}`;
                    const queued = queuedIds.has(id);
                    const failed = failedIds?.has(id) ?? false;
                    return (
                      <Pressable
                        key={c.id}
                        onPress={() => onTapCell(c.id, stage, status)}
                        onLongPress={() => onHoldCell(c.id, stage)}
                        delayLongPress={420}
                        style={[
                          styles.cell,
                          { width: CELL_W, height: ROW_H },
                          { backgroundColor: skin.bg, borderColor: colors.border },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`${c.label}, ${stage.label}, ${skin.label}`}
                      >
                        <CellMark status={status} />
                        {/* Queued: a 7px square in the corner, not a banner. The
                            tap is already safe on the device; this only says it
                            has not reached the server yet. */}
                        {queued && !failed && <View style={styles.queuedPip} />}
                        {/* Failed is the only state that changes colour, and it
                            does it with a rule under the cell rather than by
                            repainting it — the status the supervisor recorded is
                            still the truth, it just has not landed. */}
                        {failed && <View style={styles.failedRule} />}
                        {/* A note is on this cell. Bottom-left so it never
                            collides with the sync pip, and a corner wedge
                            rather than an icon because at 58px an icon is a
                            smudge. Open the hold to read it. */}
                        {cell?.note ? (
                          <View
                            style={[styles.noteFlag, { borderBottomColor: skin.text }]}
                          />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.legend}>
        <LegendChip status="pending" />
        <LegendChip status="in_progress" />
        <LegendChip status="done" />
        <LegendChip status="na" />
        <View style={styles.legendItem}>
          <View style={styles.legendSync} />
          <Text style={styles.legendText}>Waiting to sync</Text>
        </View>
      </View>

      <View style={styles.hintBox}>
        <Text style={styles.hint}>Tap a cell to advance it · hold for N/A</Text>
        <Text style={styles.rule}>
          N/A LEAVES THE DENOMINATOR · WORKING COUNTS AS HALF
        </Text>
      </View>
    </View>
  );
}

/**
 * What a cell shows.
 *
 * Done is a tick. Working is a square with its lower half filled — the glyph
 * says what the arithmetic says, that a stage in progress counts as half a
 * stage, without a legend having to explain it. Not started shows nothing,
 * which is the paper sheet's blank.
 */
function CellMark({ status }: { status: CellStatus }) {
  const skin = CELL_STYLE[status];
  if (status === "done") {
    return <Text style={[styles.cellTick, { color: skin.text }]}>✓</Text>;
  }
  if (status === "na") {
    return <Text style={[styles.cellNa, { color: skin.text }]}>N/A</Text>;
  }
  if (status === "in_progress") {
    return (
      <View style={[styles.halfBox, { borderColor: skin.text }]}>
        <View style={[styles.halfFill, { borderBottomColor: skin.text }]} />
      </View>
    );
  }
  return null;
}

function LegendChip({ status }: { status: CellStatus }) {
  const skin = CELL_STYLE[status];
  return (
    <View style={styles.legendItem}>
      <View
        style={[styles.legendSwatch, { backgroundColor: skin.bg, borderColor: skin.border }]}
      />
      <Text style={styles.legendText}>{skin.label}</Text>
    </View>
  );
}

/**
 * "Hold 3" → "H3", "Tank 12" → "T12".
 *
 * A column head has room for two or three characters, not seven — and this
 * has to work for a tanker's labels as well as a bulker's.
 */
function shortLabel(label: string) {
  const trimmed = label.trim();
  const n = trimmed.match(/(\d+)\s*$/);
  if (n && trimmed[0]) return `${trimmed[0].toUpperCase()}${n[1]}`;
  return trimmed.slice(0, 3).toUpperCase();
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  split: { flexDirection: "row" },
  labelCol: { width: LABEL_W },
  row: { flexDirection: "row" },

  stageHeadCell: {
    width: LABEL_W,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    justifyContent: "flex-end",
    backgroundColor: colors.navy,
  },
  axisLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.onDarkMuted,
    fontWeight: "600",
  },
  colHead: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.navy,
    borderLeftWidth: 1,
    borderLeftColor: colors.navyLine,
  },
  colHeadLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.onDark,
    letterSpacing: 0.5,
  },
  colHeadPct: {
    fontSize: 10,
    color: colors.aquaTint,
    marginTop: 2,
    letterSpacing: 0.3,
  },

  stageCell: {
    width: LABEL_W,
    paddingHorizontal: space.sm,
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  stageLabel: { fontSize: 13, fontWeight: "700", color: colors.text, lineHeight: 16 },
  stageShort: {
    fontSize: 9,
    color: colors.faint,
    marginTop: 3,
    letterSpacing: 1,
    fontWeight: "600",
  },

  cell: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  cellTick: { fontSize: 18, fontWeight: "700" },
  cellNa: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },

  /* A square with its lower-left half filled: "counts as half", drawn. */
  halfBox: { width: 17, height: 17, borderWidth: 1.5, overflow: "hidden" },
  halfFill: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 0,
    height: 0,
    borderBottomWidth: 14,
    borderRightWidth: 14,
    borderRightColor: "transparent",
  },

  queuedPip: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 0,
    backgroundColor: colors.navy,
  },
  noteFlag: {
    position: "absolute",
    left: 2,
    bottom: 2,
    width: 0,
    height: 0,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderRightColor: "transparent",
  },
  headNoteDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 6,
    height: 6,
    backgroundColor: colors.aqua,
  },
  failedRule: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: colors.danger,
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.md,
    marginTop: space.md,
    paddingHorizontal: space.xs,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendSwatch: { width: 14, height: 14, borderRadius: 0, borderWidth: 1 },
  legendSync: { width: 10, height: 10, borderRadius: 0, backgroundColor: colors.navy },
  legendText: { fontSize: 12, color: colors.textBody },

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
