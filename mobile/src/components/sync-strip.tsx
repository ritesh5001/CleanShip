import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "../theme";

/**
 * What the device has, and whether the server has it too.
 *
 * Four states, and none of them shout. A supervisor works most of a shift with
 * no signal; a red banner every time would train them to ignore the one that
 * matters. So: synced is a hairline and a green dot, queued goes cool grey,
 * syncing goes blue, and only failed changes colour — because only failed
 * needs a decision.
 *
 * The count is the reassurance that does the real work. "2 taps safe on
 * device" says the thing a supervisor actually wants to know, which is not
 * whether there is signal but whether their work survived.
 */

export type SyncState = "synced" | "queued" | "syncing" | "failed";

type Props = {
  state: SyncState;
  /** How many taps are still on the device. */
  queued: number;
  /** Last successful sync, for the synced line. */
  syncedAt?: string | null;
  onRetry?: () => void;
};

const SKIN: Record<SyncState, { dot: string; bg: string; border: string; text: string }> = {
  synced: { dot: colors.ok, bg: colors.card, border: colors.border, text: colors.muted },
  queued: { dot: colors.faint, bg: colors.bg, border: colors.borderStrong, text: colors.textBody },
  syncing: { dot: colors.blue, bg: colors.blueWash, border: colors.blueTint, text: colors.blue },
  failed: {
    dot: colors.danger,
    bg: colors.dangerBg,
    border: colors.dangerBorder,
    text: colors.danger,
  },
};

export function SyncStrip({ state, queued, syncedAt, onRetry }: Props) {
  const skin = SKIN[state];

  const message =
    state === "synced"
      ? syncedAt
        ? `Everything saved · synced ${syncedAt}`
        : "Everything saved"
      : state === "queued"
        ? `Offline · ${queued} ${queued === 1 ? "tap" : "taps"} safe on device`
        : state === "syncing"
          ? `Sending ${queued} ${queued === 1 ? "tap" : "taps"}…`
          : `${queued} ${queued === 1 ? "tap" : "taps"} didn't land · held, not lost`;

  return (
    <View
      style={[styles.strip, { backgroundColor: skin.bg, borderColor: skin.border }]}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.dot, { backgroundColor: skin.dot }]} />
      <Text style={[styles.text, { color: skin.text }]} numberOfLines={1}>
        {message}
      </Text>
      {state === "failed" && onRetry && (
        <Pressable onPress={onRetry} style={styles.retry} accessibilityRole="button">
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { flex: 1, fontSize: 12, letterSpacing: 0.3 },
  retry: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.danger,
  },
  retryText: { color: colors.onDark, fontSize: 12, fontWeight: "700" },
});
