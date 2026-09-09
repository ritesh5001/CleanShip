/**
 * A colour per cleaning stage.
 *
 * The four cell statuses answer "how far has this got"; these answer "which
 * stage is it". A customer looking at a hold wants both at once — which is
 * why each stage gets its own hue and each hue two shades: the light one means
 * the stage is under way, the dark one means it is finished.
 *
 * Hues are spaced far enough apart to survive a phone screen in a meeting, and
 * chosen cool and desaturated so a row of six does not fight the marine
 * palette around it.
 *
 * Six stages is the usual case; the list runs to nine so a long tanker preset
 * still gets distinct colours rather than wrapping onto a repeat.
 */

export type StageShade = { light: string; dark: string; ink: string };

const RAMP: StageShade[] = [
  { light: "#bfd8ef", dark: "#1461a0", ink: "#0b3a63" }, // working blue
  { light: "#b7e2e5", dark: "#00929b", ink: "#04585d" }, // aqua
  { light: "#c8dcc1", dark: "#4f7a3a", ink: "#2c4620" }, // moss
  { light: "#d8d1e8", dark: "#63509b", ink: "#382c59" }, // violet
  { light: "#f0d8bb", dark: "#a86a20", ink: "#5e3a0f" }, // ochre
  { light: "#f2ccd1", dark: "#a3434f", ink: "#5c252c" }, // rose
  { light: "#cbd9e6", dark: "#3f5f7d", ink: "#233648" }, // steel
  { light: "#e0dbc2", dark: "#867634", ink: "#4a411c" }, // olive
  { light: "#cdd3de", dark: "#5b6472", ink: "#333940" }, // graphite
];

/**
 * When every applicable stage is finished the hold stops being a set of
 * stages and becomes one fact — ready — so it is painted in a single green
 * rather than in six separate colours the reader has to add up.
 */
export const COMPLETE_GREEN = { light: "#8fce6a", dark: "#4f9c2b", ink: "#14400a" };

/** Not applicable: struck out, and deliberately colourless. */
export const NA_GREY = { light: "#c9ced3", dark: "#7f7f7f", ink: "#ffffff" };

export function stageShade(index: number): StageShade {
  return RAMP[index % RAMP.length];
}
