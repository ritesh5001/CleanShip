/**
 * The shapes the CleanTrack API returns, and the pure helpers that read them.
 *
 * This file is a deliberate copy of the vocabulary in backend/src/domain —
 * the two now deploy separately (this app on Vercel, the API on Render), so
 * they cannot share a module. What is copied is only the part that never
 * changes without a coordinated release: the four cell statuses and how they
 * roll up. Everything variable — which stages a vessel has, what they are
 * called — comes down the wire on `vessel.stages` and is never hardcoded here.
 */

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
  shareToken?: string;
  shareRevoked?: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  progress: Progress & { compartmentsComplete: number; compartmentsTotal: number };
};

export type VesselDetail = VesselSummary & {
  compartments: CompartmentDetail[];
};

/** The customer's view: no share token, no crew names, no internal notes. */
export type PublicVessel = Omit<
  VesselDetail,
  "shareToken" | "shareRevoked" | "supervisorId" | "supervisorName" | "notes"
>;

export type CellEvent = {
  id: number;
  compartmentLabel: string;
  stageKey: string;
  stageLabel: string;
  fromStatus: CellStatus;
  toStatus: CellStatus;
  note: string | null;
  userName: string;
  occurredAt: string;
  recordedAt: string;
};

export type StageTemplate = {
  id: string;
  name: string;
  type: VesselType;
  stages: Stage[];
};

/* -------------------------------------------------------------------- */
/* Status presentation                                                  */
/* -------------------------------------------------------------------- */

export const CELL_STATUSES: CellStatus[] = ["pending", "in_progress", "done", "na"];

/**
 * One colour language across the grid, the diagram and the customer view,
 * matching the paper sheet: blank, yellow, green, blocked out.
 */
export const CELL_STYLE: Record<
  CellStatus,
  { label: string; short: string; cell: string; dot: string; fill: string; stroke: string }
> = {
  pending: {
    label: "Not started",
    short: "—",
    cell: "bg-white text-slate-400 border-slate-300",
    dot: "bg-white border-slate-300",
    fill: "#ffffff",
    stroke: "#c8d2dc",
  },
  in_progress: {
    label: "In progress",
    short: "In progress",
    cell: "bg-amber-100 text-amber-900 border-amber-400",
    dot: "bg-amber-300 border-amber-500",
    fill: "#fdf3c4",
    stroke: "#d6a90a",
  },
  done: {
    label: "Done",
    short: "Done",
    cell: "bg-lime-300 text-lime-950 border-lime-600",
    dot: "bg-lime-400 border-lime-600",
    fill: "#8fce6a",
    stroke: "#4f9c2b",
  },
  na: {
    label: "Not applicable",
    short: "N/A",
    cell: "bg-slate-400 text-white border-slate-500",
    dot: "bg-slate-400 border-slate-500",
    fill: "#7f7f7f",
    stroke: "#5f5f5f",
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
 * Progress over a set of cells. Must match the backend's rule exactly, or the
 * optimistic number a supervisor sees on tap will jump when the server
 * answers: `na` leaves the denominator, in-progress counts half.
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
  compartment: Pick<CompartmentDetail, "cells">,
  stages: Stage[],
): CellStatus[] {
  return stages.map((s) => compartment.cells[s.key]?.status ?? "pending");
}

/** Compartment-level colours: the chip in text, the same colours in SVG. */
export const STATE_STYLE: Record<
  CompartmentState,
  { label: string; chip: string; fill: string; stroke: string; text: string }
> = {
  "not-started": {
    label: "Not started",
    chip: "bg-slate-100 text-slate-600 border-slate-300",
    fill: "#e8edf2",
    stroke: "#b9c5cf",
    text: "#4c5c6b",
  },
  "in-progress": {
    label: "In progress",
    chip: "bg-amber-100 text-amber-800 border-amber-400",
    fill: "#fdefd0",
    stroke: "#c9880d",
    text: "#8a5c05",
  },
  complete: {
    label: "Complete",
    chip: "bg-emerald-100 text-emerald-800 border-emerald-400",
    fill: "#d9f2e4",
    stroke: "#1e9e63",
    text: "#116843",
  },
};

/** "Hold" or "Tank". */
export function compartmentNoun(type: VesselType, plural = false) {
  const noun = type === "tank" ? "Tank" : "Hold";
  return plural ? `${noun}s` : noun;
}


/* -------------------------------------------------------------------- */
/* Work times                                                           */
/* -------------------------------------------------------------------- */

/**
 * A start or finish time, for a screen someone reads at a desk.
 *
 * Same-day times show as "14:05". Anything older carries the date, because on
 * a job running past midnight "02:10" alone is genuinely ambiguous about which
 * night it means — and that ambiguity is what an invoice dispute turns on.
 */
export function formatWorkTime(value: string | null | undefined): string {
  if (!value) return "—";
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return "—";

  const time = at.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const sameDay =
    at.getFullYear() === now.getFullYear() &&
    at.getMonth() === now.getMonth() &&
    at.getDate() === now.getDate();
  if (sameDay) return time;

  const date = at.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${date} ${time}`;
}

/** "3h 20m" — how long a stage took. Null while it is unfinished. */
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
