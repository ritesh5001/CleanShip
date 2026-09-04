/**
 * The shapes the CleanTrack API returns, and the pure helpers that read them.
 *
 * A deliberate copy of the vocabulary in the API's own domain layer. This app
 * ships to phones through a store and cannot import from the server, so the
 * part that is duplicated is only what never changes without a coordinated
 * release: the four cell statuses and how they roll up. Everything variable —
 * which stages a vessel has, what they are called — arrives on `vessel.stages`
 * and is never hardcoded here.
 */

export type Role = "admin" | "editor" | "supervisor";

export type SessionUser = {
  sub: number;
  email: string;
  name: string;
  role: Role;
};

export type Stage = { key: string; label: string; short: string };

export type CellStatus = "pending" | "in_progress" | "done" | "na";

export type VesselType = "hold" | "tank";

export type VesselStatus = "scheduled" | "in-progress" | "complete" | "cancelled";

export type Cell = {
  id?: number;
  status: CellStatus;
  note: string | null;
  /** When the work was done — distinct from when it was recorded. */
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
  updatedByName?: string | null;
};

export type Progress = { done: number; total: number; ratio: number };

export type CompartmentDetail = {
  id: number;
  vesselId: number;
  position: number;
  label: string;
  notes: string | null;
  updatedAt: string;
  /** Keyed by stage key, so the grid is a lookup rather than a search. */
  cells: Record<string, Cell>;
  state: CompartmentState;
  progress: Progress;
  /** Earliest start and latest finish across the stages that apply. */
  startedAt: string | null;
  completedAt: string | null;
};

export type VesselSummary = {
  id: number;
  reference: string;
  name: string;
  imo: string | null;
  port: string;
  berth: string | null;
  type: VesselType;
  status: VesselStatus;
  clientId: number | null;
  clientName: string | null;
  supervisorId: number | null;
  supervisorName: string | null;
  stages: Stage[];
  compartmentCount: number;
  scheduledFor: string | null;
  startedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  progress: Progress & { compartmentsComplete: number; compartmentsTotal: number };
};

export type VesselDetail = VesselSummary & {
  compartments: CompartmentDetail[];
};

/* -------------------------------------------------------------------- */
/* Status presentation                                                  */
/* -------------------------------------------------------------------- */

export const CELL_STATUSES: CellStatus[] = ["pending", "in_progress", "done", "na"];

/**
 * The colour language of the paper status sheet: blank, yellow, green, and
 * blocked out. Kept identical to the web app so a supervisor comparing their
 * phone to the office screen sees the same picture.
 */
export const CELL_STYLE: Record<
  CellStatus,
  { label: string; short: string; bg: string; border: string; text: string }
> = {
  pending: {
    label: "Not started",
    short: "",
    bg: "#ffffff",
    border: "#c8d2dc",
    text: "#5b6b7a",
  },
  in_progress: {
    label: "In progress",
    short: "Working",
    bg: "#fdf3c4",
    border: "#d6a90a",
    text: "#7d5c00",
  },
  done: {
    label: "Done",
    short: "Done",
    bg: "#8fce6a",
    border: "#4f9c2b",
    text: "#14400a",
  },
  na: {
    label: "N/A",
    short: "N/A",
    bg: "#7f7f7f",
    border: "#5f5f5f",
    text: "#ffffff",
  },
};

/** What a tap moves to. `na` is only ever set deliberately, never by cycling. */
export function nextStatusOnTap(current: CellStatus): CellStatus {
  if (current === "pending") return "in_progress";
  if (current === "in_progress") return "done";
  return "pending";
}

/* -------------------------------------------------------------------- */
/* Rollups                                                              */
/* -------------------------------------------------------------------- */

/**
 * Must match the API's rule exactly, or the number a supervisor sees the
 * instant they tap will jump when the server answers: `na` leaves the
 * denominator, in-progress counts half.
 */
export function progressOf(statuses: CellStatus[]): Progress {
  const counted = statuses.filter((s) => s !== "na");
  if (counted.length === 0) return { done: 0, total: 0, ratio: 1 };
  const done = counted.filter((s) => s === "done").length;
  const partial = counted.filter((s) => s === "in_progress").length * 0.5;
  return { done, total: counted.length, ratio: (done + partial) / counted.length };
}

export type CompartmentState = "not-started" | "in-progress" | "complete";

export function compartmentState(statuses: CellStatus[]): CompartmentState {
  const counted = statuses.filter((s) => s !== "na");
  if (counted.length === 0) return "complete";
  if (counted.every((s) => s === "done")) return "complete";
  if (counted.some((s) => s !== "pending")) return "in-progress";
  return "not-started";
}

/** Statuses of one compartment, read in the vessel's own stage order. */
export function statusesOf(
  cells: Record<string, { status: CellStatus }>,
  stages: Stage[],
): CellStatus[] {
  return stages.map((s) => cells[s.key]?.status ?? "pending");
}

export const STATE_STYLE: Record<
  CompartmentState,
  { label: string; bg: string; border: string; text: string }
> = {
  "not-started": {
    label: "Not started",
    bg: "#f1f5f9",
    border: "#cbd5e1",
    text: "#475569",
  },
  "in-progress": {
    label: "In progress",
    bg: "#fef3c7",
    border: "#f59e0b",
    text: "#92400e",
  },
  complete: {
    label: "Complete",
    bg: "#d1fae5",
    border: "#10b981",
    text: "#065f46",
  },
};

export const VESSEL_STATUS_STYLE: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  scheduled: { bg: "#f1f5f9", border: "#cbd5e1", text: "#475569" },
  "in-progress": { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  complete: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  cancelled: { bg: "#fee2e2", border: "#f87171", text: "#991b1b" },
};

/** "Hold" or "Tank". */
export function compartmentNoun(type: VesselType, plural = false) {
  const noun = type === "tank" ? "Tank" : "Hold";
  return plural ? `${noun}s` : noun;
}


/* -------------------------------------------------------------------- */
/* Times                                                                */
/* -------------------------------------------------------------------- */

/**
 * A time a supervisor can read at a glance on a deck.
 *
 * Same-day times show as "14:05". Anything older carries the date, because on
 * a job running past midnight "02:10" alone is genuinely ambiguous about which
 * night it means — and that ambiguity is what an invoice dispute turns on.
 */
export function formatWorkTime(value: string | null | undefined): string {
  if (!value) return "—";
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return "—";

  const time = at.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const now = new Date();
  const sameDay =
    at.getFullYear() === now.getFullYear() &&
    at.getMonth() === now.getMonth() &&
    at.getDate() === now.getDate();
  if (sameDay) return time;

  const date = at.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
  return `${date} ${time}`;
}

/** "3h 20m" — how long a stage took. Null when it is not finished. */
export function formatDuration(
  startedAt: string | null | undefined,
  completedAt: string | null | undefined,
): string | null {
  if (!startedAt || !completedAt) return null;
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;

  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
