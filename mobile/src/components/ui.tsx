import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, space, TAP } from "../theme";

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  busy = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  busy?: boolean;
  disabled?: boolean;
}) {
  const off = disabled || busy;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: off, busy }}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
        pressed && !off ? { opacity: 0.85 } : null,
        off ? { opacity: 0.5 } : null,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : colors.navy} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "primary" ? { color: "#fff" } : { color: colors.text },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Chip({
  label,
  bg,
  border,
  text,
}: {
  label: string;
  bg: string;
  border: string;
  text: string;
}) {
  return (
    <View
      style={[styles.chip, { backgroundColor: bg, borderColor: border }]}
    >
      <Text style={[styles.chipText, { color: text }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ ratio }: { ratio: number }) {
  const pct = Math.max(0, Math.min(1, ratio));
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${pct * 100}%`,
            backgroundColor: pct === 1 ? "#10b981" : "#f59e0b",
          },
        ]}
      />
    </View>
  );
}

export function Banner({
  tone,
  children,
}: {
  tone: "warn" | "error" | "info";
  children: ReactNode;
}) {
  const palette =
    tone === "error"
      ? { bg: colors.dangerBg, border: colors.dangerBorder, text: colors.danger }
      : tone === "warn"
        ? { bg: colors.warnBg, border: colors.warnBorder, text: colors.warn }
        : { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" };

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      <Text style={[styles.bannerText, { color: palette.text }]}>{children}</Text>
    </View>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Card style={{ padding: space.xl, alignItems: "center" }}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    minHeight: TAP,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  buttonPrimary: { backgroundColor: colors.blueDark },
  buttonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  buttonText: { fontSize: 16, fontWeight: "700" },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  chipText: { fontSize: 12, fontWeight: "700" },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 999 },
  banner: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  bannerText: { fontSize: 14, lineHeight: 20 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  emptyBody: {
    marginTop: space.sm,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});
