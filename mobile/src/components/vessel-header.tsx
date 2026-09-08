import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "../theme";

/**
 * The vessel bar that sits above the grid.
 *
 * Navy, because it is a header and not another card in the stack — on a screen
 * that is otherwise a pale grid, the one dark band tells a supervisor at a
 * glance which vessel they are recording against. That matters more than it
 * sounds: a supervisor works two ships in a shift and the fastest way to
 * corrupt a record is to tap the right hold on the wrong vessel.
 *
 * The percentage is the only aqua on the screen, so the eye lands on it first.
 */

type Props = {
  name: string;
  imo?: string | null;
  berth?: string | null;
  port?: string | null;
  percent: number;
};

export function VesselHeader({ name, imo, berth, port, percent }: Props) {
  const line = [imo ? `IMO ${imo}` : null, port, berth].filter(Boolean).join(" · ");

  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>
          {name.toUpperCase()}
        </Text>
        {line ? (
          <Text style={styles.meta} numberOfLines={1}>
            {line.toUpperCase()}
          </Text>
        ) : null}
      </View>
      <Text style={styles.percent}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  left: { flex: 1, minWidth: 0 },
  name: {
    color: colors.onDark,
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  meta: {
    color: colors.aquaTint,
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 1.1,
  },
  percent: {
    color: colors.aquaTint,
    fontSize: 27,
    fontWeight: "700",
  },
});
