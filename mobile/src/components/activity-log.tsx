import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "../theme";
import { CELL_STYLE, formatWorkTime, type CellEvent, type CellStatus } from "../types";

/** The same words on every activity view: commenced and completed. */
const VERB: Record<CellStatus, string> = {
  pending: "Reset",
  in_progress: "Commenced",
  done: "Completed",
  na: "Not applicable",
};

/**
 * The latest recorded activity on each hold or tank, newest first — one line
 * per compartment; the API drops older entries for a hold once a newer one
 * exists.
 *
 * The supervisor already knows what they themselves tapped. What they cannot
 * otherwise see is what the office corrected, what the previous shift left,
 * and — the one that settles arguments — the clock time a stage is on record
 * as having finished.
 */

type Props = {
  events: CellEvent[];
  loading: boolean;
  error: string | null;
};

export function ActivityLog({ events, loading, error }: Props) {
  if (loading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={colors.navy} />
        <Text style={styles.stateText}>Loading the log…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateText}>{error}</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateText}>Nothing recorded on this vessel yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {events.map((e) => {
        const skin = CELL_STYLE[e.toStatus];
        return (
          <View key={e.id} style={styles.row}>
            <Text style={styles.when}>{formatWorkTime(e.occurredAt)}</Text>

            <View style={styles.body}>
              <Text style={styles.what}>
                <Text style={styles.where}>{e.compartmentLabel}</Text>
                {" · "}
                {e.stageLabel}
              </Text>

              <View style={styles.line}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: skin.bg, borderColor: skin.border },
                  ]}
                >
                  <Text style={[styles.chipText, { color: skin.text }]}>
                    {VERB[e.toStatus]}
                  </Text>
                </View>
                <Text style={styles.who} numberOfLines={1}>
                  {e.userName}
                </Text>
              </View>

              {e.note ? <Text style={styles.note}>“{e.note}”</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  list: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  row: {
    flexDirection: "row",
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  when: {
    width: 62,
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    paddingTop: 2,
  },
  body: { flex: 1, minWidth: 0, gap: 6 },
  what: { fontSize: 14, color: colors.textBody },
  where: { fontWeight: "700", color: colors.text },
  line: { flexDirection: "row", alignItems: "center", gap: space.sm },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: { fontSize: 11, fontWeight: "700" },
  who: { flex: 1, fontSize: 12, color: colors.faint },
  note: { fontSize: 13, color: colors.textBody, fontStyle: "italic" },

  state: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: space.xl,
    alignItems: "center",
    gap: space.sm,
  },
  stateText: { fontSize: 14, color: colors.muted, textAlign: "center" },
});
