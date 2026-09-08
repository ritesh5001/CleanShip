import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
  /** Compartment ids with a tap still on the device, for the sync pip. */
  queuedIds: Set<string>;
  onTapCell: (compartmentId: number, stage: Stage, current: CellStatus) => void;
  onHoldCell: (compartmentId: number, stage: Stage) => void;
  onOpenCompartment: (compartmentId: number) => void;
};

export function TransposedGrid({
  compartments,
  stages,
  queuedIds,
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
                {compartments[i * PER_PAGE]?.label ?? ""}
                {" – "}
                {compartments[Math.min((i + 1) * PER_PAGE, compartments.length) - 1]?.label ?? ""}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.frame}>
        {/* Column heads: the compartment, its percentage, and a way in to the
            hold detail where notes and time corrections live. */}
        <View style={styles.row}>
          <View style={styles.stageHeadCell}>
            <Text style={styles.axisLabel}>Stage</Text>
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
              const queued = queuedIds.has(`${c.id}:${stage.key}`);
              return (
                <Pressable
                  key={c.id}
                  onPress={() => onTapCell(c.id, stage, status)}
                  onLongPress={() => onHoldCell(c.id, stage)}
                  delayLongPress={420}
                  style={[
                    styles.cell,
                    { backgroundColor: skin.bg, borderColor: skin.border },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${c.label}, ${stage.label}, ${skin.label}`}
                >
                  <Text style={[styles.cellMark, { color: skin.text }]}>
                    {status === "done" ? "✓" : status === "na" ? "N/A" : ""}
                  </Text>
                  {/* Queued: a 7px square in the corner, not a banner. The tap
                      is already safe on the device; this only says it has not
                      reached the server yet. */}
                  {queued && <View style={styles.queuedPip} />}
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
      </View>

      <Text style={styles.hint}>Tap a cell to advance it · hold for N/A</Text>
      <Text style={styles.rule}>
        N/A LEAVES THE DENOMINATOR · WORKING COUNTS AS HALF
      </Text>
    </View>
  );
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
    backgroundColor: colors.blueWash,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  axisLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.muted,
    fontWeight: "600",
  },
  colHead: {
    flex: 1,
    minWidth: CELL_MIN_W,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.sm,
    backgroundColor: colors.blueWash,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  colHeadLabel: { fontSize: 14, fontWeight: "700", color: colors.text },
  colHeadPct: { fontSize: 11, color: colors.muted, marginTop: 2 },

  stageCell: {
    width: 104,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    minHeight: CELL_MIN_H,
  },
  stageLabel: { fontSize: 13, fontWeight: "600", color: colors.text, lineHeight: 16 },
  stageShort: { fontSize: 10, color: colors.faint, marginTop: 2, letterSpacing: 0.6 },

  cell: {
    flex: 1,
    minWidth: CELL_MIN_W,
    minHeight: CELL_MIN_H,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  cellMark: { fontSize: 15, fontWeight: "700" },
  queuedPip: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: colors.muted,
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.md,
    marginTop: space.md,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendSwatch: { width: 14, height: 14, borderRadius: 2, borderWidth: 1 },
  legendText: { fontSize: 12, color: colors.muted },

  hint: { marginTop: space.md, fontSize: 13, color: colors.textBody },
  rule: {
    marginTop: space.xs,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.faint,
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
  pageTabText: { fontSize: 12, fontWeight: "600", color: colors.muted },
  pageTabTextOn: { color: colors.onDark },
});
