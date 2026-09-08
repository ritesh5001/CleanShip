import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, space } from "../theme";

/**
 * What the device has, and whether the server has it too.
 *
 * Four states, and none of them shout. A supervisor works most of a shift with
 * no signal; a red banner every time would train them to ignore the one that
 * matters. So synced, queued and syncing are quiet strips that differ only in
 * their dot and their words — and only failed takes colour, because only
 * failed needs a decision.
 *
 * The count is the reassurance that does the real work. "2 taps safe on
 * device" answers what a supervisor actually wants to know, which is not
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

const SKIN: Record<SyncState, { dot: string; bg: string; text: string }> = {
  synced: { dot: colors.ok, bg: colors.card, text: colors.muted },
  queued: { dot: colors.faint, bg: colors.bg, text: colors.textBody },
  syncing: { dot: colors.blue, bg: colors.blueWash, text: colors.blue },
  failed: { dot: colors.danger, bg: colors.dangerBg, text: colors.danger },
};

export function SyncStrip({ state, queued, syncedAt, onRetry }: Props) {
  const skin = SKIN[state];
  const taps = `${queued} ${queued === 1 ? "TAP" : "TAPS"}`;

  const message =
    state === "synced"
      ? syncedAt
        ? `EVERYTHING SAVED · SYNCED ${syncedAt}`
        : "EVERYTHING SAVED"
      : state === "queued"
        ? `OFFLINE · ${taps} SAFE ON DEVICE`
        : state === "syncing"
          ? `SENDING ${taps}…`
          : `${taps} DIDN'T LAND · HELD, NOT LOST`;

  return (
    <View
      style={[styles.strip, { backgroundColor: skin.bg }]}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.dot, { backgroundColor: skin.dot }]} />
      <Text style={[styles.text, { color: skin.text }]} numberOfLines={1}>
        {message}
      </Text>
      {state === "failed" && onRetry && (
        <Pressable onPress={onRetry} accessibilityRole="button" hitSlop={10}>
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
    paddingVertical: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { flex: 1, fontSize: 11, letterSpacing: 0.9, fontWeight: "600" },
  retryText: { color: colors.danger, fontSize: 14, fontWeight: "700" },
});
