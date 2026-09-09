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
import { CELL_STYLE } from "../types";
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
  kind,
  initial,
  minDate,
  maxDate,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  /** Which time is being recorded — drives the banner and its colour. */
  kind: "started" | "finished";
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
  /* The colour of the status being recorded, so the banner belongs to the
     same language as the cell that produced it. */
  const skin = CELL_STYLE[kind === "started" ? "in_progress" : "done"];

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

  const hour = value.getHours();
  const minute = value.getMinutes();

  /** Rebuilds the instant from the wheels, then holds it inside the window. */
  function setParts(next: { h?: number; m?: number }) {
    const candidate = new Date(value);
    candidate.setHours(next.h ?? hour, next.m ?? minute, 0, 0);
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
      <View style={styles.root}>
        {/* The dismiss layer is a SIBLING behind the sheet, not its parent.
           Wrapping the sheet in a Pressable — or having it claim the responder
           itself — meant something upstream of the wheels took the touch on
           press-down, and the wheels never got to scroll. Nothing above them
           handles touches now, so the gesture reaches them untouched. */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Close without saving"
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          {/* Big, short and in the status's own colour. The old line read
              "When was this finished?" in small grey — a sentence to parse at
              04:00 in gloves, and easy to answer for the wrong field. This is
              one word, in the yellow of a stage under way or the green of a
              finished one, so the answer is obvious before it is read. */}
          <View
            style={[
              styles.kind,
              {
                backgroundColor: skin.bg,
                borderColor: skin.border,
              },
            ]}
          >
            <Text style={[styles.kindText, { color: skin.text }]}>
              {kind === "started" ? "STARTED" : "FINISHED"}
            </Text>
          </View>

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
              value={hour}
              onChange={(h) => setParts({ h })}
              format={(h) => String(h).padStart(2, "0")}
              accessibilityLabel="Hour"
              width={96}
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
              width={96}
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
      </View>
    </Modal>
  );
}

/* 24-hour throughout. A cleaning record that says "7:40" is ambiguous on a
   job that runs through the night, and that ambiguity is what an invoice
   dispute turns on — so there is no am/pm anywhere in this product. */
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

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
  root: {
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
  kind: {
    alignSelf: "flex-start",
    marginTop: space.sm,
    borderWidth: 2,
    paddingHorizontal: space.md,
    paddingVertical: 6,
  },
  kindText: { fontSize: 24, fontWeight: "700", letterSpacing: 1.4 },

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

  /* What is about to be written, spelled out and given real weight. The
     wheels are quick but easy to leave a notch off, and this is the line that
     catches it before it becomes the record. */
  readback: {
    marginTop: space.md,
    paddingVertical: space.md,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: colors.text,
    textAlign: "center",
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
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
