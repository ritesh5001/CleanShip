/**
 * One place for colour and spacing.
 *
 * The palette is the CleanShip marine token set — navy, working blue, one aqua
 * accent, cool neutrals — because a supervisor holding this phone next to the
 * office screen should see one product rather than two. It previously shipped
 * a generic slate/indigo palette, which read as a different product entirely.
 *
 * Values mirror `cleanship design system/tokens/colors.css`. The four cell
 * statuses are NOT here: they live in `types.ts` as CELL_STYLE, shared with the
 * web app so the paper-sheet colours stay identical everywhere.
 *
 * Tap targets are larger than a typical app's: this is used on a deck, in
 * gloves, in weather.
 */
export const colors = {
  /* Navy — headers, dark panels */
  navy: "#0a2e52",
  navyDeep: "#06203a",
  navyLine: "#0e3d6b",

  /* Blue — primary action */
  blue: "#1461a0",
  blueDark: "#0e3d6b",
  blueTint: "#dceaf6",
  blueWash: "#f1f7fc",

  /* Aqua — accent, used sparingly: rules, active states, counters */
  aqua: "#00b0b9",
  aquaDark: "#00929b",
  aquaTint: "#9de3e7",

  /* Cool neutrals — never warm */
  bg: "#f6f8fa",
  card: "#ffffff",
  border: "#dce4eb",
  borderStrong: "#b9c5cf",
  text: "#0f1c27",
  textBody: "#243545",
  muted: "#6b7c8b",
  faint: "#8a9aa8",

  /* Semantic — distinct from the four cell statuses */
  danger: "#c6472f",
  dangerBg: "#fae5e0",
  dangerBorder: "#e2a091",
  warn: "#c9880d",
  warnBg: "#fbf0d8",
  warnBorder: "#e0bb6b",
  ok: "#1e9e63",
  okBg: "#e2f4ea",

  onDark: "#ffffff",
  onDarkMuted: "rgba(255,255,255,0.72)",
  onDarkLine: "rgba(255,255,255,0.16)",
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

/**
 * Square. Not "nearly square" — the CleanTrack UI measures 0px on every
 * surface, control and chip; the only curves in the whole design are the 8px
 * status dots. The token file's 2-6px scale is the marketing site's; this
 * product is the drawing-office end of the brand and reads as one.
 */
export const radius = { sm: 0, md: 0, lg: 0 };

/** Status dots stay circular — the one exception. */
export const DOT_RADIUS = 999;

/** Android's minimum is 48dp; on a wet deck in gloves it wants more. */
export const TAP = 52;
