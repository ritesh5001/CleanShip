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
  minDate,
  maxDate,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  initial: Date;
  /**
   * The window work on this vessel could plausibly have happened in: from the
   * day it came onto the books to two months later, never past now.
   *
   * Bounded on purpose. An open-ended date control on a deck is an invitation
   * to record 2019 by fat-fingering a year, and a wrong date on a cleaning
   * record is only ever discovered when someone is arguing about an invoice.
   */
  minDate: Date;
  maxDate: Date;
  onConfirm: (value: Date) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  const [text, setText] = useState(toHHMM(initial));
  const [error, setError] = useState<string | null>(null);

  const clamp = (date: Date) => {
    if (date.getTime() < minDate.getTime()) return new Date(minDate);
    if (date.getTime() > maxDate.getTime()) return new Date(maxDate);
    return date;
  };

  /* Reset each time it is opened for a different stage, or the previous
     stage's time would be sitting there waiting to be confirmed by mistake. */
  useEffect(() => {
    if (!visible) return;
    const start = clamp(initial);
    setValue(start);
    setText(toHHMM(start));
    setError(null);
    /* clamp is derived from the bounds, which are stable for a vessel. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initial, minDate, maxDate]);

  function shift(minutes: number) {
    const capped = clamp(new Date(value.getTime() + minutes * 60_000));
    setValue(capped);
    setText(toHHMM(capped));
    setError(null);
  }

  /**
   * Steps whole days, stopping at the ends of the vessel's window.
   *
   * Compared at DAY granularity, not by instant. The bounds are dates — "the
   * day the vessel came on, through two months later" — so a step onto a
   * valid day must be allowed whatever time of day it lands on. Comparing
   * timestamps instead makes the first and last day of the window
   * unreachable for half their length, which reads as a dead button.
   */
  function shiftDay(days: number) {
    const next = new Date(value);
    next.setDate(next.getDate() + days);
    if (!dayWithin(next, minDate, maxDate)) return;

    /* The day is fine but the time on it may not be — stepping onto today
       must not land later than now. */
    setValue(next.getTime() > maxDate.getTime() ? new Date(maxDate) : next);
    setError(null);
  }

  const canGoBack = (() => {
    const previous = new Date(value);
    previous.setDate(previous.getDate() - 1);
    return dayWithin(previous, minDate, maxDate);
  })();

  const canGoForward = (() => {
    const next = new Date(value);
    next.setDate(next.getDate() + 1);
    return dayWithin(next, minDate, maxDate);
  })();

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
       shift entering 23:40 at 00:20. Rolling back a day is what they meant,
       but only if yesterday is still inside the vessel's window. */
    if (next.getTime() > maxDate.getTime()) {
      const previous = new Date(next);
      previous.setDate(previous.getDate() - 1);
      if (previous.getTime() >= minDate.getTime()) {
        next.setTime(previous.getTime());
      }
    }

    const capped = clamp(next);
    if (capped.getTime() !== next.getTime()) {
      setError("That is outside this vessel's dates.");
    }
    setValue(capped);
    setText(toHHMM(capped));
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

          {/* Date, stepped a day at a time and stopped at the ends of the
              vessel's own window. A stepper rather than a calendar because
              the realistic correction is "yesterday", not "pick any day", and
              the arrows go dead at the boundary instead of silently accepting
              a date that cannot be right. */}
          <View style={styles.dateRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous day"
              accessibilityState={{ disabled: !canGoBack }}
              disabled={!canGoBack}
              onPress={() => shiftDay(-1)}
              style={({ pressed }) => [
                styles.step,
                !canGoBack && styles.stepOff,
                pressed && canGoBack && { opacity: 0.6 },
              ]}
            >
              <Text style={[styles.stepText, !canGoBack && styles.stepTextOff]}>
                ‹
              </Text>
            </Pressable>

            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{describeDay(value)}</Text>
              <Text style={styles.dateFull}>{fullDate(value)}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next day"
              accessibilityState={{ disabled: !canGoForward }}
              disabled={!canGoForward}
              onPress={() => shiftDay(1)}
              style={({ pressed }) => [
                styles.step,
                !canGoForward && styles.stepOff,
                pressed && canGoForward && { opacity: 0.6 },
              ]}
            >
              <Text
                style={[styles.stepText, !canGoForward && styles.stepTextOff]}
              >
                ›
              </Text>
            </Pressable>
          </View>

          <Text style={styles.big}>{toHHMM(value)}</Text>

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

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Whether a date's DAY falls inside the window, ignoring the time on it. */
function dayWithin(date: Date, min: Date, max: Date) {
  const day = startOfDay(date).getTime();
  return day >= startOfDay(min).getTime() && day <= startOfDay(max).getTime();
}

/** "4 Sep 2026" — the unambiguous form, for the line under the day name. */
function fullDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
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
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.lg,
  },
  step: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  stepOff: { opacity: 0.35 },
  stepText: { fontSize: 26, fontWeight: "800", color: colors.navy, lineHeight: 30 },
  stepTextOff: { color: colors.faint },
  dateBox: { flex: 1, alignItems: "center" },
  dateText: { fontSize: 16, fontWeight: "800", color: colors.text },
  dateFull: { marginTop: 1, fontSize: 12, color: colors.muted },
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
