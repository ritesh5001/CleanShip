import { useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, space } from "../theme";

/**
 * One scrolling column, the way a phone's alarm sets a time.
 *
 * A supervisor already knows this control without being taught it, which is
 * the whole argument for it: the previous stepper needed reading, and reading
 * is the thing there is least of on a deck. The selected value sits in the
 * middle at full weight and its neighbours fade, so the column can be set by
 * feel and confirmed with a glance.
 *
 * Snapping is done with `snapToInterval` rather than by hand, so the wheel
 * lands on a value and never between two.
 */

export const ITEM_HEIGHT = 52;
/** Three rows visible: the value, and one either side for context. */
const VISIBLE = 3;

type Props<T> = {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  /** How each item reads. Defaults to `String(item)`. */
  format?: (item: T) => string;
  /** Column width; the am/pm column wants less than the digits do. */
  width?: number;
  accessibilityLabel: string;
};

export function WheelPicker<T>({
  items,
  value,
  onChange,
  format = (i) => String(i),
  width = 88,
  accessibilityLabel,
}: Props<T>) {
  const ref = useRef<ScrollView>(null);
  const index = Math.max(0, items.indexOf(value));
  /* Tracks what the wheel is showing so a value change we caused ourselves
     does not bounce the scroll position back under the user's thumb. */
  const settled = useRef(index);

  useEffect(() => {
    if (index === settled.current) return;
    settled.current = index;
    ref.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  }, [index]);

  function onSettle(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.min(Math.max(next, 0), items.length - 1);
    if (clamped === settled.current) return;
    settled.current = clamped;
    onChange(items[clamped]);
  }

  return (
    <View style={[styles.column, { width }]}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: index * ITEM_HEIGHT }}
        onMomentumScrollEnd={onSettle}
        /* Web fires no momentum event, so settle on the plain scroll end. */
        onScrollEndDrag={Platform.OS === "web" ? onSettle : undefined}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        accessibilityLabel={accessibilityLabel}
      >
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.text, i === index ? styles.on : styles.off]}>
              {format(item)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/** The frame the three columns sit in, with the selection band drawn once. */
export function WheelFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.frame}>
      {/* Rules above and below the middle row: the band says "this one" without
          a fill that would fight the four status colours used everywhere else. */}
      <View style={styles.band} pointerEvents="none" />
      <View style={styles.row}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: space.md,
    justifyContent: "center",
  },
  row: { flexDirection: "row", justifyContent: "center" },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderStrong,
  },
  column: { height: ITEM_HEIGHT * VISIBLE },
  item: { height: ITEM_HEIGHT, alignItems: "center", justifyContent: "center" },
  text: { fontVariant: ["tabular-nums"] },
  on: { fontSize: 34, fontWeight: "700", color: colors.text },
  off: { fontSize: 30, fontWeight: "600", color: colors.borderStrong },
});
