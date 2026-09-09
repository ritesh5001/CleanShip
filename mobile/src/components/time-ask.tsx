import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radius, space, TAP } from "../theme";
import { WheelFrame, WheelPicker } from "./wheel-picker";

/**
 * Asks when something happened.
 *
 * Two controls, in the order a supervisor thinks: which day, then what time.
 *
 * The day is a row of the last seven, because that is the honest range of a
 * correction. Work recorded later than a week is not a correction, it is a
 * reconstruction, and a control that offers two months of history invites a
 * mistyped date nobody notices until an invoice is disputed.
 *
 * The time is a wheel, the way every phone sets an alarm. It needs no reading,
 * which matters more than it sounds: this is used in gloves, on a wet deck, at
 * four in the morning.
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
   * The window work on this vessel could plausibly have happened in. The day
   * row narrows it further to the last seven days; this still bounds it, so a
   * vessel that came onto the books three days ago offers three days, not
   * seven.
   */
  minDate: Date;
  maxDate: Date;
  onConfirm: (value: Date) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);

  const clamp = (date: Date) => {
    if (date.getTime() < minDate.getTime()) return new Date(minDate);
    if (date.getTime() > maxDate.getTime()) return new Date(maxDate);
    return date;
  };

  /* Reset each time it is opened for a different stage, or the previous
     stage's time would be sitting there waiting to be confirmed by mistake. */
  useEffect(() => {
    if (!visible) return;
    setValue(clamp(initial));
    /* clamp is derived from the bounds, which are stable for a vessel. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initial, minDate, maxDate]);

  /** The last seven days, newest first, trimmed to the vessel's own window. */
  const days = useMemo(() => {
    const out: Date[] = [];
    const today = startOfDay(new Date());
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      if (dayWithin(day, minDate, maxDate)) out.push(day);
    }
    return out;
  }, [minDate, maxDate]);

  const hour12 = ((value.getHours() + 11) % 12) + 1;
  const minute = value.getMinutes();
  const meridiem: Meridiem = value.getHours() < 12 ? "am" : "pm";

  /** Rebuilds the instant from the wheels, then holds it inside the window. */
  function setParts(next: { h?: number; m?: number; ap?: Meridiem }) {
    const h12 = next.h ?? hour12;
    const mm = next.m ?? minute;
    const ap = next.ap ?? meridiem;
    const h24 = (ap === "am" ? h12 % 12 : (h12 % 12) + 12);

    const candidate = new Date(value);
    candidate.setHours(h24, mm, 0, 0);
    setValue(clamp(candidate));
  }

  function setDay(day: Date) {
    const next = new Date(day);
    next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    setValue(clamp(next));
  }

  const sameDay = (a: Date, b: Date) =>
    startOfDay(a).getTime() === startOfDay(b).getTime();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        {/* A plain View, not a Pressable. On Android a Pressable here claims
           the touch on press-in and the wheels below never became the scroll
           responder — the picker rendered but would not turn. Claiming the
           responder only as a fallback keeps the backdrop from closing on a
           tap inside the sheet while leaving children free to scroll. */}
        <View
          style={styles.sheet}
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => {}}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Day first: a night shift entering 23:40 at 00:20 needs to say
              "yesterday" before the time means anything. */}
          <Text style={styles.legend}>DAY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayRow}
          >
            {days.map((day) => {
              const on = sameDay(day, value);
              return (
                <Pressable
                  key={day.toISOString()}
                  onPress={() => setDay(day)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.day, on && styles.dayOn]}
                >
                  <Text style={[styles.dayName, on && styles.dayTextOn]}>
                    {describeDay(day)}
                  </Text>
                  <Text style={[styles.dayDate, on && styles.dayTextOn]}>
                    {shortDate(day)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.legend}>TIME</Text>
          <WheelFrame>
            <WheelPicker
              items={HOURS}
              value={hour12}
              onChange={(h) => setParts({ h })}
              accessibilityLabel="Hour"
              width={84}
            />
            <View style={styles.colon}>
              <Text style={styles.colonText}>:</Text>
            </View>
            <WheelPicker
              items={MINUTES}
              value={minute}
              onChange={(m) => setParts({ m })}
              format={(m) => String(m).padStart(2, "0")}
              accessibilityLabel="Minute"
              width={84}
            />
            <WheelPicker
              items={MERIDIEMS}
              value={meridiem}
              onChange={(ap) => setParts({ ap })}
              accessibilityLabel="Morning or afternoon"
              width={72}
            />
          </WheelFrame>

          {/* The instant in full, spelled out. The wheels are fast but they are
              also easy to leave one notch off, and this is the line that
              catches it before it becomes the record. */}
          <Text style={styles.readback}>{fullReadback(value)}</Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              style={[styles.action, styles.cancel]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(value)}
              accessibilityRole="button"
              style={[styles.action, styles.confirm]}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

type Meridiem = "am" | "pm";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const MERIDIEMS: Meridiem[] = ["am", "pm"];

/** "Today" / "Yesterday" / a weekday — so a night shift is never ambiguous. */
function describeDay(date: Date) {
  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    startOfDay(a).getTime() === startOfDay(b).getTime();

  if (sameDay(date, today)) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, { weekday: "short" });
}

/** "4 Sep" — the line under the day name. */
function shortDate(date: Date) {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** "Yesterday, 4 Sep · 02:10" — the whole instant, unambiguous. */
function fullReadback(date: Date) {
  const hhmm = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
  return `${describeDay(date)}, ${shortDate(date)} · ${hhmm}`;
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(6,32,58,0.62)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    padding: space.lg,
    borderTopWidth: 3,
    borderTopColor: colors.blue,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },

  legend: {
    marginTop: space.lg,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.faint,
  },

  dayRow: { gap: space.sm, paddingVertical: space.sm },
  day: {
    minWidth: 74,
    minHeight: TAP,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  dayOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  dayName: { fontSize: 14, fontWeight: "700", color: colors.text },
  dayDate: { fontSize: 11, color: colors.muted, marginTop: 2 },
  dayTextOn: { color: colors.onDark },

  colon: { justifyContent: "center", paddingHorizontal: 2 },
  colonText: { fontSize: 30, fontWeight: "700", color: colors.text },

  readback: {
    marginTop: space.md,
    fontSize: 13,
    letterSpacing: 0.6,
    color: colors.textBody,
    textAlign: "center",
  },

  actions: { flexDirection: "row", gap: space.md, marginTop: space.lg },
  action: {
    flex: 1,
    minHeight: TAP,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: radius.md,
  },
  cancel: { backgroundColor: colors.card, borderColor: colors.borderStrong },
  cancelText: { fontSize: 16, fontWeight: "700", color: colors.text },
  confirm: { backgroundColor: colors.blue, borderColor: colors.blueDark },
  confirmText: { fontSize: 16, fontWeight: "700", color: colors.onDark },
});
