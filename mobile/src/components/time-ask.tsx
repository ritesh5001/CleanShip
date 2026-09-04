import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radius, space, TAP } from "../theme";

/**
 * Asks when something happened.
 *
 * Built from plain React Native primitives rather than the platform picker,
 * for two reasons. The native one does not exist on web, so it silently does
 * nothing there — which makes the whole flow untestable in a browser. And a
 * spinner is a poor control in gloves on a wet deck.
 *
 * What a supervisor actually needs is rarely an arbitrary datetime. It is
 * "now" (they are recording as they work) or "a bit ago" (they got to the
 * phone late). So the quick offsets are the primary control and typing is the
 * fallback, not the other way round.
 */
export function TimeAsk({
  visible,
  title,
  subtitle,
  initial,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  initial: Date;
  onConfirm: (value: Date) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  const [text, setText] = useState(toHHMM(initial));
  const [error, setError] = useState<string | null>(null);

  /* Reset each time it is opened for a different stage, or the previous
     stage's time would be sitting there waiting to be confirmed by mistake. */
  useEffect(() => {
    if (!visible) return;
    setValue(initial);
    setText(toHHMM(initial));
    setError(null);
  }, [visible, initial]);

  function shift(minutes: number) {
    const next = new Date(value.getTime() + minutes * 60_000);
    /* Never past now: a stage cannot have started or finished in the future,
       and allowing it puts impossible timings in front of a customer. */
    const capped = next.getTime() > Date.now() ? new Date() : next;
    setValue(capped);
    setText(toHHMM(capped));
    setError(null);
  }

  function commitTyped(raw: string) {
    const match = raw.trim().match(/^(\d{1,2})[:.]?(\d{2})$/);
    if (!match) {
      setError("Use 24-hour time, like 02:10.");
      return;
    }
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) {
      setError("That is not a valid time.");
      return;
    }

    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    /* Typing a time later than now almost always means yesterday — a night
       shift entering 23:40 at 00:20. Rolling back a day is what they meant. */
    if (next.getTime() > Date.now()) next.setDate(next.getDate() - 1);

    setValue(next);
    setText(toHHMM(next));
    setError(null);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        {/* Stops a tap inside the sheet from closing it. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <Text style={styles.big}>{toHHMM(value)}</Text>
          <Text style={styles.day}>{describeDay(value)}</Text>

          <View style={styles.quickRow}>
            {[
              { label: "Now", minutes: null },
              { label: "−15m", minutes: -15 },
              { label: "−30m", minutes: -30 },
              { label: "−1h", minutes: -60 },
              { label: "−2h", minutes: -120 },
            ].map((option) => (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                onPress={() => {
                  if (option.minutes === null) {
                    const now = new Date();
                    setValue(now);
                    setText(toHHMM(now));
                    setError(null);
                  } else {
                    shift(option.minutes);
                  }
                }}
                style={({ pressed }) => [
                  styles.quick,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.quickText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Or type it (24-hour)</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            onBlur={() => commitTyped(text)}
            onSubmitEditing={() => commitTyped(text)}
            placeholder="02:10"
            placeholderTextColor={colors.faint}
            keyboardType="numbers-and-punctuation"
            style={styles.input}
          />
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancel,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                commitTyped(text);
                onConfirm(value);
              }}
              style={({ pressed }) => [
                styles.button,
                styles.confirm,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.confirmText}>Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function toHHMM(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

/** "Today" / "Yesterday" / a date — so a night shift is never ambiguous. */
function describeDay(date: Date) {
  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "center",
    padding: space.lg,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: space.lg,
  },
  title: { fontSize: 17, fontWeight: "800", color: colors.text },
  subtitle: { marginTop: 2, fontSize: 13, color: colors.muted },
  big: {
    marginTop: space.lg,
    fontSize: 46,
    fontWeight: "800",
    color: colors.navy,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  day: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: 2,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
    marginTop: space.lg,
    justifyContent: "center",
  },
  quick: {
    minHeight: 44,
    paddingHorizontal: space.md,
    justifyContent: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: "#f8fafc",
  },
  quickText: { fontSize: 14, fontWeight: "700", color: colors.text },
  label: {
    marginTop: space.lg,
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
  },
  input: {
    marginTop: 6,
    minHeight: TAP,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    fontSize: 18,
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  error: { marginTop: 6, fontSize: 13, color: colors.danger },
  actions: { flexDirection: "row", gap: space.sm, marginTop: space.lg },
  button: {
    flex: 1,
    minHeight: TAP,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: { borderWidth: 1, borderColor: colors.borderStrong },
  cancelText: { fontSize: 16, fontWeight: "700", color: colors.text },
  confirm: { backgroundColor: colors.blueDark },
  confirmText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
