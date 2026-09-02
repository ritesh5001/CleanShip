/**
 * The cleaning checklist.
 *
 * Stages are ORDERED and a compartment moves forward through them. The order
 * is what the progress bar, the vessel diagram colour and the "next stage"
 * button all read, so it is defined once here and never re-stated.
 *
 * ⚠️ TANK SEQUENCE NEEDS CONFIRMING.
 *
 * The hold sequence is exactly as supplied. The tank sequence is a reasonable
 * default for a chemical/product tank turnaround — it is NOT confirmed, and it
 * is the first thing to check with the operations desk. Changing it is a
 * one-line edit here; every screen follows automatically.
 */

export type JobType = "hold-cleaning" | "tank-cleaning";

export type Stage = {
  /** Stored in the database. Never rename without a migration. */
  key: string;
  label: string;
  /** Shown on the supervisor's phone where the full label will not fit. */
  short: string;
};

const HOLD_STAGES: Stage[] = [
  { key: "dry_cleaning", label: "Dry Cleaning", short: "Dry" },
  { key: "chemical", label: "Chemical Application", short: "Chem" },
  { key: "hp_washing", label: "HP Washing", short: "HP" },
  { key: "tanktop", label: "Tanktop", short: "Tanktop" },
  { key: "bilges", label: "Bilges", short: "Bilges" },
  { key: "ready", label: "Holds Ready", short: "Ready" },
];

const TANK_STAGES: Stage[] = [
  { key: "pre_wash", label: "Pre-Wash", short: "Pre" },
  { key: "chemical", label: "Chemical Wash", short: "Chem" },
  { key: "hp_washing", label: "HP Rinse", short: "Rinse" },
  { key: "mucking", label: "Mucking Out", short: "Muck" },
  { key: "gas_free", label: "Gas-Freeing", short: "Gas" },
  { key: "ready", label: "Tank Ready", short: "Ready" },
];

export function stagesFor(jobType: JobType): Stage[] {
  return jobType === "tank-cleaning" ? TANK_STAGES : HOLD_STAGES;
}

/** "Hold" or "Tank" — used everywhere a compartment is named. */
export function compartmentNoun(jobType: JobType, plural = false) {
  const noun = jobType === "tank-cleaning" ? "Tank" : "Hold";
  return plural ? `${noun}s` : noun;
}

/**
 * Compartment labels. Holds are numbered, tanks are lettered — that is the
 * convention on the paper sheet this replaces.
 */
export function compartmentLabel(jobType: JobType, index: number) {
  if (jobType === "tank-cleaning") {
    /* A–Z, then AA, AB… so a 30-tank vessel does not run out of letters. */
    let n = index;
    let out = "";
    do {
      out = String.fromCharCode(65 + (n % 26)) + out;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return `Tank ${out}`;
  }
  return `Hold ${index + 1}`;
}

/* -------------------------------------------------------------------- */
/* Progress                                                             */
/* -------------------------------------------------------------------- */

/**
 * How far through the checklist a compartment is.
 *
 * `completed` holds the stage keys that are done. Progress is the count of
 * completed stages over the total, NOT the index of the furthest one — a
 * supervisor can legitimately complete Bilges before Tanktop, and the bar
 * should reflect work done rather than assume a strict march.
 */
export function progressOf(completed: string[], jobType: JobType) {
  const stages = stagesFor(jobType);
  const done = stages.filter((s) => completed.includes(s.key)).length;
  return { done, total: stages.length, ratio: done / stages.length };
}

export type CompartmentState = "not-started" | "in-progress" | "complete";

export function stateOf(completed: string[], jobType: JobType): CompartmentState {
  const { done, total } = progressOf(completed, jobType);
  if (done === 0) return "not-started";
  return done === total ? "complete" : "in-progress";
}

/** The next stage a supervisor would normally tap. Null when finished. */
export function nextStage(completed: string[], jobType: JobType): Stage | null {
  return stagesFor(jobType).find((s) => !completed.includes(s.key)) ?? null;
}

/** Shared colour language: grey not started, amber in progress, green done. */
export const STATE_STYLE: Record<
  CompartmentState,
  { fill: string; stroke: string; text: string; chip: string; label: string }
> = {
  "not-started": {
    fill: "#e8edf2",
    stroke: "#b9c5cf",
    text: "#4c5c6b",
    chip: "bg-slate-100 text-slate-600 border-slate-300",
    label: "Not started",
  },
  "in-progress": {
    fill: "#fdefd0",
    stroke: "#c9880d",
    text: "#8a5c05",
    chip: "bg-amber-100 text-amber-800 border-amber-400",
    label: "In progress",
  },
  complete: {
    fill: "#d9f2e4",
    stroke: "#1e9e63",
    text: "#116843",
    chip: "bg-emerald-100 text-emerald-800 border-emerald-400",
    label: "Complete",
  },
};
