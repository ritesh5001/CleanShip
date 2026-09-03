/**
 * One place for colour and spacing.
 *
 * The palette is the web app's, because a supervisor holding this phone next
 * to the office screen should see one product rather than two. Tap targets are
 * larger than a typical app's: this is used on a deck, in gloves, in weather.
 */
export const colors = {
  navy: "#0a2e52",
  blue: "#1d4ed8",
  blueDark: "#1e40af",
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  danger: "#b91c1c",
  dangerBg: "#fef2f2",
  dangerBorder: "#fca5a5",
  warn: "#92400e",
  warnBg: "#fffbeb",
  warnBorder: "#fbbf24",
  ok: "#065f46",
  okBg: "#ecfdf5",
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = { sm: 6, md: 10, lg: 14 };

/** Android's minimum is 48dp; on a wet deck in gloves it wants more. */
export const TAP = 52;
