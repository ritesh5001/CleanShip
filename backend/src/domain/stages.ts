/**
 * Stages: the columns of the status sheet.
 *
 * A stage list belongs to a VESSEL, not to the code. The templates below are
 * only the starting point the admin sees when creating one — they can rename,
 * reorder, add or delete before saving, and what they save is what that vessel
 * uses forever. That is why nothing here is imported at read time to decide
 * what a vessel's columns are: `vessel.stages` is the answer, always.
 */

export type Stage = {
  /** Stored in every cell row. Stable for the life of the vessel. */
  key: string;
  /** Column heading. "Dry Cleaning". */
  label: string;
  /** Shown on a supervisor's phone where the full label will not fit. */
  short: string;
};

export type StageTemplate = {
  id: string;
  name: string;
  /** Which vessel type it is offered for. */
  type: "hold" | "tank";
  stages: Stage[];
};

/**
 * Starting points, offered in the create form.
 *
 * The hold sequence is the one on the supplied status sheet. The tank sequence
 * follows the demucking/sludge-removal sheet. Both are editable per vessel, so
 * treat them as defaults rather than doctrine.
 */
export const STAGE_TEMPLATES: StageTemplate[] = [
  {
    id: "hold-standard",
    name: "Hold cleaning — standard",
    type: "hold",
    stages: [
      { key: "dry_cleaning", label: "Dry Cleaning", short: "Dry" },
      { key: "chemical", label: "Chemical Application", short: "Chem" },
      { key: "hp_washing", label: "HP Washing", short: "HP" },
      { key: "tanktop", label: "Tanktop", short: "Tanktop" },
      { key: "bilges", label: "Bilges", short: "Bilges" },
      { key: "ready", label: "Holds Ready", short: "Ready" },
    ],
  },
  {
    id: "tank-standard",
    name: "Tank cleaning — standard",
    type: "tank",
    stages: [
      { key: "demucking", label: "Demucking", short: "Demuck" },
      { key: "sludge_removal", label: "Sludge Removal", short: "Sludge" },
      { key: "chemical", label: "Chemical Wash", short: "Chem" },
      { key: "hp_rinse", label: "HP Rinse", short: "Rinse" },
      { key: "gas_free", label: "Gas-Freeing", short: "Gas" },
      { key: "ready", label: "Tank Ready", short: "Ready" },
    ],
  },
];

export function templatesFor(type: "hold" | "tank") {
  return STAGE_TEMPLATES.filter((t) => t.type === type);
}

/**
 * Turns a free-typed stage name into a storage key.
 *
 * Keys are derived once, at creation, and then frozen: renaming a stage later
 * changes its label and leaves the key alone, so no cell is ever orphaned.
 */
export function stageKeyFrom(label: string, taken: Set<string> = new Set()) {
  const base =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 36) || "stage";
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}_${n}`.slice(0, 40);
    if (!taken.has(candidate)) return candidate;
  }
}

/* -------------------------------------------------------------------- */
/* Compartment naming                                                   */
/* -------------------------------------------------------------------- */

/** "Hold" or "Tank" — used wherever a compartment is named in prose. */
export function compartmentNoun(type: "hold" | "tank", plural = false) {
  const noun = type === "tank" ? "Tank" : "Hold";
  return plural ? `${noun}s` : noun;
}

/**
 * Default labels for a compartment at `index`.
 *
 * Holds are numbered. Tanks come in port/starboard pairs — "1p", "1s", "2p" —
 * which is how the tank sheet reads, and getting this default right saves the
 * admin retyping twenty labels on every vessel. Both are editable at creation.
 */
export function defaultCompartmentLabel(type: "hold" | "tank", index: number) {
  if (type === "tank") {
    const pair = Math.floor(index / 2) + 1;
    return `${pair}${index % 2 === 0 ? "p" : "s"}`;
  }
  return `Hold No. ${index + 1}`;
}

export function defaultCompartmentLabels(type: "hold" | "tank", count: number) {
  return Array.from({ length: count }, (_, i) => defaultCompartmentLabel(type, i));
}

/* -------------------------------------------------------------------- */
/* Cell status                                                          */
/* -------------------------------------------------------------------- */

export type CellStatus = "pending" | "in_progress" | "done" | "na";

export const CELL_STATUSES: CellStatus[] = [
  "pending",
  "in_progress",
  "done",
  "na",
];

export function isCellStatus(value: unknown): value is CellStatus {
  return (
    typeof value === "string" && CELL_STATUSES.includes(value as CellStatus)
  );
}

/**
 * One colour language, defined once and shared by every surface: the
 * supervisor's grid, the admin board, the customer view and the PDF.
 *
 * The hex values are here rather than in the frontend because a printed
 * report and a web page have to agree, and two copies of a palette drift.
 */
export const CELL_STYLE: Record<
  CellStatus,
  { label: string; fill: string; stroke: string; text: string }
> = {
  pending: {
    label: "Not started",
    fill: "#ffffff",
    stroke: "#c8d2dc",
    text: "#5b6b7a",
  },
  in_progress: {
    label: "In progress",
    fill: "#fdf3c4",
    stroke: "#d6a90a",
    text: "#7d5c00",
  },
  done: {
    label: "Done",
    fill: "#8fce6a",
    stroke: "#4f9c2b",
    text: "#14400a",
  },
  na: {
    label: "Not applicable",
    fill: "#7f7f7f",
    stroke: "#5f5f5f",
    text: "#ffffff",
  },
};

/** What a tap cycles to. `na` is never reached by tapping — it is deliberate. */
export function nextStatusOnTap(current: CellStatus): CellStatus {
  if (current === "pending") return "in_progress";
  if (current === "in_progress") return "done";
  if (current === "done") return "pending";
  return "pending";
}

/* -------------------------------------------------------------------- */
/* Progress                                                             */
/* -------------------------------------------------------------------- */

export type Progress = {
  done: number;
  total: number;
  ratio: number;
};

/**
 * Progress over a set of cells.
 *
 * `na` cells leave the denominator entirely — they are not work anyone will
 * ever do. In-progress cells count as half, which is the difference between a
 * bar that moves during a shift and one that sits still for six hours.
 */
export function progressOf(statuses: CellStatus[]): Progress {
  const counted = statuses.filter((s) => s !== "na");
  if (counted.length === 0) return { done: 0, total: 0, ratio: 1 };
  const done = counted.filter((s) => s === "done").length;
  const partial = counted.filter((s) => s === "in_progress").length * 0.5;
  return {
    done,
    total: counted.length,
    ratio: (done + partial) / counted.length,
  };
}

export type CompartmentState = "not-started" | "in-progress" | "complete";

export function compartmentState(statuses: CellStatus[]): CompartmentState {
  const counted = statuses.filter((s) => s !== "na");
  if (counted.length === 0) return "complete";
  if (counted.every((s) => s === "done")) return "complete";
  if (counted.some((s) => s !== "pending")) return "in-progress";
  return "not-started";
}
