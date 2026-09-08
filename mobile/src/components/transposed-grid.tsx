import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, CELL_MIN_W, CELL_MIN_H } from "../theme";
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
 * means the axis that grows — up to nine holds — is the one with no room, so
 * the grid scrolls sideways and the supervisor loses the vessel.
 *
 * Turned, the axis that grows runs across the short side and the one that is
 * effectively fixed (there are always about six stages) runs down. The whole
 * vessel then fits one screen with no horizontal scroll at all, which is the
 * entire point: a supervisor can see which hold is behind without moving
 * anything.
 *
 * Past seven compartments even this runs out of width, so it pages in groups
 * rather than scrolling — a page boundary is honest about hiding something in
 * a way a half-visible column is not.
 */

const PER_PAGE = 7;

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
  const [page, setPage] = useState(0);
  const pages = Math.ceil(compartments.length / PER_PAGE) || 1;
  const shown = useMemo(
    () => compartments.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE),
    [compartments, page],
  );

  return (
    <View>
      {pages > 1 && (
        <View style={styles.pager}>
          {Array.from({ length: pages }, (_, i) => (
            <Pressable
              key={i}
              onPress={() => setPage(i)}
              style={[styles.pageTab, i === page && styles.pageTabOn]}
              accessibilityRole="tab"
              accessibilityState={{ selected: i === page }}
            >
              <Text style={[styles.pageTabText, i === page && styles.pageTabTextOn]}>
                {shortLabel(compartments[i * PER_PAGE]?.label ?? "")}
                {"–"}
                {shortLabel(
                  compartments[Math.min((i + 1) * PER_PAGE, compartments.length) - 1]
                    ?.label ?? "",
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.frame}>
        {/* Column heads sit on navy so the axis reads as a header rather than
            as another row of cells. Tapping one drills into that hold. */}
        <View style={styles.row}>
          <View style={styles.stageHeadCell}>
            <Text style={styles.axisLabel}>STAGE</Text>
          </View>
          {shown.map((c) => {
            const pct = Math.round(progressOf(statusesOf(c.cells, stages)).ratio * 100);
            return (
              <Pressable
                key={c.id}
                onPress={() => onOpenCompartment(c.id)}
                style={styles.colHead}
                accessibilityRole="button"
                accessibilityLabel={`Open ${c.label}, ${pct} percent complete`}
              >
                <Text style={styles.colHeadLabel} numberOfLines={1}>
                  {shortLabel(c.label)}
                </Text>
                <Text style={styles.colHeadPct}>{pct}%</Text>
              </Pressable>
            );
          })}
        </View>

        {stages.map((stage) => (
          <View key={stage.key} style={styles.row}>
            <View style={styles.stageCell}>
              <Text style={styles.stageLabel} numberOfLines={2}>
                {stage.label}
              </Text>
              <Text style={styles.stageShort}>{stage.short.toUpperCase()}</Text>
            </View>

            {shown.map((c) => {
              const status = c.cells[stage.key]?.status ?? "pending";
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
                    { backgroundColor: skin.bg, borderColor: colors.border },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${c.label}, ${stage.label}, ${skin.label}`}
                >
                  <CellMark status={status} />
                  {/* Queued: a 7px square in the corner, not a banner. The tap
                      is already safe on the device; this only says it has not
                      reached the server yet. */}
                  {queued && !failed && <View style={styles.queuedPip} />}
                  {/* Failed is the only state that changes colour, and it does
                      it with a rule under the cell rather than by repainting
                      the cell — the status the supervisor recorded is still
                      the truth, it just has not landed. */}
                  {failed && <View style={styles.failedRule} />}
                </Pressable>
              );
            })}
          </View>
        ))}
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

/** "Hold 3" → "H3": a column head has room for two characters, not seven. */
function shortLabel(label: string) {
  const n = label.match(/(\d+)\s*$/);
  if (n) return `${label.trim()[0].toUpperCase()}${n[1]}`;
  return label.slice(0, 3).toUpperCase();
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  row: { flexDirection: "row" },

  stageHeadCell: {
    width: 104,
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
    flex: 1,
    minWidth: CELL_MIN_W,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.sm,
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
    width: 104,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    minHeight: CELL_MIN_H,
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
    flex: 1,
    minWidth: CELL_MIN_W,
    minHeight: CELL_MIN_H,
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

  pager: { flexDirection: "row", gap: space.sm, marginBottom: space.sm },
  pageTab: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pageTabOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  pageTabText: { fontSize: 12, fontWeight: "700", color: colors.muted },
  pageTabTextOn: { color: colors.onDark },
});
