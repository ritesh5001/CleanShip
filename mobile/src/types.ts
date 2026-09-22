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

export type Role = "superadmin" | "admin" | "supervisor" | "crew";

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
  /** A gang is physically in this compartment right now, 0 or 1. */
  active: number;
  activeSince: string | null;
};

export type VesselSummary = {
  id: number;
  reference: string;
  name: string;
  imo: string | null;
  port: string;
  berth: string | null;
  destination: string | null;
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
  /**
   * When the crew reported to the hold — the switch from joining to working.
   *
   * Null means the gang is still travelling and the app leads with the joining
   * board. Set means they are aboard and the cleaning sheet takes over. It is
   * one fact about the vessel rather than one per person, because the gang
   * arrives together and the ship starts when they do.
   */
  holdReportedAt: string | null;
  holdReportedByName: string | null;
  notes: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  progress: Progress & { compartmentsComplete: number; compartmentsTotal: number };
};

export type VesselDetail = VesselSummary & {
  compartments: CompartmentDetail[];
};

/**
 * One recorded change, as the audit trail keeps it.
 *
 * `occurredAt` is when the work happened; `recordedAt` is when the phone got
 * it to the server. They differ by hours on a job with no signal, and the
 * distinction is the whole point of keeping both.
 */
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

/**
 * What a tap moves to. `na` is only ever set deliberately, never by cycling.
 *
 * The vessel's last stage is a readiness check rather than work — a hold has
 * either passed inspection or it has not, and "Holds Ready, in progress" is
 * not a state anyone can act on. So the final stage toggles straight to done
 * and back, and never sits at half a stage in the arithmetic.
 */
export function nextStatusOnTap(current: CellStatus, isFinal = false): CellStatus {
  if (isFinal) return current === "done" ? "pending" : "done";
  if (current === "pending") return "in_progress";
  if (current === "in_progress") return "done";
  return "pending";
}

/**
 * The readiness stage: the last one in this vessel's own order.
 *
 * Read positionally rather than by key, because stages are per-vessel and an
 * admin can rename or reorder them — "ready" is not a key that can be relied
 * on, but "the one at the end" always is.
 */
export function isFinalStage(stage: Stage, stages: Stage[]) {
  return stages.length > 0 && stages[stages.length - 1].key === stage.key;
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
  /* Same four colours the cells use, rolled up. A compartment does not get a
     palette of its own — that is how the phone and the office drifted apart. */
  "not-started": {
    label: "Not started",
    bg: "#ffffff",
    border: "#c8d2dc",
    text: "#5b6b7a",
  },
  "in-progress": {
    label: "Working",
    bg: "#fdf3c4",
    border: "#d6a90a",
    text: "#7d5c00",
  },
  complete: {
    label: "Complete",
    bg: "#8fce6a",
    border: "#4f9c2b",
    text: "#14400a",
  },
};

export const VESSEL_STATUS_STYLE: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  /* The cell language one level up: a working vessel wears the same yellow a
     working cell does, a finished one the same green. One system, not two. */
  scheduled: { bg: "#ffffff", border: "#c8d2dc", text: "#5b6b7a" },
  "in-progress": { bg: "#fdf3c4", border: "#d6a90a", text: "#7d5c00" },
  complete: { bg: "#8fce6a", border: "#4f9c2b", text: "#14400a" },
  cancelled: { bg: "#fae5e0", border: "#c6472f", text: "#c6472f" },
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
 * Clock time, with no time zones anywhere.
 *
 * A supervisor who picks 05:00 means 05:00 — on the phone, on the office
 * screen and on the customer's page alike. Storing a real UTC instant and
 * converting back for each viewer made the same record read differently
 * depending on whose device or server was showing it, and let a finish appear
 * to come before its start.
 *
 * So every time the product records is a wall-clock time written into the
 * UTC fields of a Date: 05:00 on 14 Sep is stored as 2026-09-14T05:00:00Z,
 * and every display reads it back with UTC getters. Nothing converts.
 */

/** Now, as this device's wall clock reads it, in the stored form. */
export function wallNow(): Date {
  const d = new Date();
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
    ),
  );
}

/**
 * How far ahead of now a time may be entered: one day.
 *
 * Crews and the office sometimes log a stage ahead of time — a start booked
 * for first light, a finish the shift already knows. Past a day it is far
 * more likely a wrong date than a plan, so it stops there.
 */
export const FUTURE_ALLOWANCE_MS = 24 * 60 * 60 * 1000;

/** The latest time a stage may be given: now plus the future allowance. */
export function latestAllowed(): Date {
  return new Date(wallNow().getTime() + FUTURE_ALLOWANCE_MS);
}

const pad = (n: number) => String(n).padStart(2, "0");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "05:00" — the stored clock time, unconverted. */
export function clockOf(value: Date): string {
  return `${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}`;
}

/** "14 Sep" — the stored date, unconverted. */
export function dateOf(value: Date): string {
  return `${value.getUTCDate()} ${MONTHS[value.getUTCMonth()]}`;
}

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

  const now = wallNow();
  const sameDay =
    at.getUTCFullYear() === now.getUTCFullYear() &&
    at.getUTCMonth() === now.getUTCMonth() &&
    at.getUTCDate() === now.getUTCDate();
  return sameDay ? clockOf(at) : `${dateOf(at)} ${clockOf(at)}`;
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

/* -------------------------------------------------------------------- */
/* Time windows                                                          */
/*                                                                       */
/* Two screens now ask a supervisor when something happened — the status  */
/* grid, on a tap that advances a stage, and the time log, on a tap     */
/* that corrects a recorded time. The rules that bound those answers live */
/* here rather than at either call site, because they mirror the API's    */
/* own `resolveTimes` and a copy that drifts produces the worst possible  */
/* failure: a picker that offers a time the server will refuse, which a   */
/* supervisor experiences as the app losing their work.                   */
/* -------------------------------------------------------------------- */

const MINUTE_MS = 60_000;

export type TimeWindow = { min: Date; max: Date };

/** Which of a cell's two times is being recorded. */
export type TimeKind = "started" | "finished";

/**
 * The window a time may fall in for this vessel.
 *
 * From the day the vessel came onto the books — its scheduled date, or when
 * the record was created if it was never scheduled — to two months later, and
 * never past now.
 *
 * Bounded because an open-ended date control on a deck is how a cleaning
 * record ends up dated 2019, and that only ever surfaces when someone is
 * arguing about an invoice. Two months is comfortably longer than any
 * turnaround while still ruling out a mistyped year.
 *
 * Both ends are capped at now so a vessel scheduled for next week cannot
 * produce a window that starts in the future.
 */
export function vesselTimeWindow(
  vessel: { scheduledFor: string | null; createdAt: string } | null,
): TimeWindow {
  const now = wallNow();
  const anchor = vessel ? new Date(vessel.scheduledFor ?? vessel.createdAt) : now;

  const twoMonthsOn = new Date(anchor);
  twoMonthsOn.setUTCMonth(twoMonthsOn.getUTCMonth() + 2);

  /* Start of the anchor DAY, not the instant the record was created — the
     whole of that day is inside the window, and a vessel added at 15:13
     should not refuse work recorded at 09:00 the same morning. */
  const min = new Date(Math.min(anchor.getTime(), now.getTime()));
  min.setUTCHours(0, 0, 0, 0);
  const max = new Date(Math.min(twoMonthsOn.getTime(), latestAllowed().getTime()));
  return { min, max: max.getTime() < min.getTime() ? new Date(min) : max };
}

/**
 * Narrows the vessel's window down to one particular time being picked.
 *
 * A finish is always LATER than its start — not equal — so the earliest finish
 * on offer is one minute after the start. A start is symmetrically at least a
 * minute before a recorded finish. The picker then offers nothing outside that
 * range at all, so the supervisor is stopped by a dead arrow rather than by a
 * rejection they only learn about after the fact.
 *
 * The upper bound is read from the clock HERE rather than taken from
 * `window.max`: the window is computed once when a vessel loads and its "now"
 * ages. Open the app at 07:42, tap at 07:52, and a stale bound clamps the pick
 * back ten minutes.
 */
export function timeBounds(
  kind: TimeKind,
  window: TimeWindow,
  /** The cell's OTHER time, which bounds this one. */
  counterpart: string | null | undefined,
): TimeWindow {
  let min = window.min;
  let max = latestAllowed();

  if (counterpart) {
    const other = new Date(counterpart).getTime();
    if (Number.isFinite(other)) {
      if (kind === "finished") {
        const afterStart = new Date(other + MINUTE_MS);
        if (afterStart.getTime() > min.getTime()) min = afterStart;
      } else {
        const beforeFinish = new Date(other - MINUTE_MS);
        if (beforeFinish.getTime() < max.getTime()) max = beforeFinish;
      }
    }
  }

  if (max.getTime() < min.getTime()) max = new Date(min);
  return { min, max };
}

/** Holds a pre-filled time inside its bounds. */
export function clampTime(value: Date, bounds: TimeWindow): Date {
  if (value.getTime() < bounds.min.getTime()) return new Date(bounds.min);
  if (value.getTime() > bounds.max.getTime()) return new Date(bounds.max);
  return value;
}

/**
 * The status a cell must carry for a recorded time to mean anything.
 *
 * The API clears both times whenever a cell is `pending` or `na` — a stage
 * nobody claims to have worked has no timing. So setting a time from the time
 * sheet has to carry the cell to the weakest status that keeps it: a start
 * makes a blank stage `in_progress`, a finish makes any stage `done`. A stage
 * that is already further along keeps the status it has; correcting a start
 * time on a finished stage must not un-finish it.
 *
 * `na` never reaches here — the time log does not let those cells be tapped,
 * because silently reviving a stage the office ruled out is not a correction.
 */
export function statusForTimeEdit(kind: TimeKind, current: CellStatus): CellStatus {
  if (kind === "finished") return "done";
  return current === "pending" ? "in_progress" : current;
}

/**
 * A recorded time split for the time log, which always shows both halves.
 *
 * `formatWorkTime` drops the date on same-day times, which is right for a
 * glance at one cell and wrong for a sheet of them: a grid where some cells
 * carry a date and some do not cannot be read down a column.
 */
export function workDateTime(
  value: string | null | undefined,
): { date: string; clock: string } | null {
  if (!value) return null;
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return null;
  return { date: dateOf(at), clock: clockOf(at) };
}


/* -------------------------------------------------------------------- */
/* Crew mobilisation                                                     */
/*                                                                       */
/* Getting people onto the ship, before any hold is cleaned. The printed  */
/* joining sheet: a row per document, a row per checklist item, and the   */
/* travel chain from a hotel to an aircraft door.                         */
/*                                                                       */
/* It ends when the crew report to the hold. That is one fact about the   */
/* VESSEL, not one per person — the gang arrives together and the ship    */
/* starts when they do — so every screen here keys off the vessel's       */
/* `holdReportedAt` rather than anything on the individual.               */
/* -------------------------------------------------------------------- */

/** A row on the joining sheet. Keys are frozen; labels can be reworded. */
export type CrewItem = { key: string; label: string };

/**
 * Three states, matching the sheet.
 *
 * `expired` is not a worse kind of missing. It is the case where somebody has
 * a document, believes they are covered, and is not — which is the one that
 * stops a flight at the gate, so it gets its own colour rather than being
 * folded into "not done".
 */
export type DocumentState = "pending" | "done" | "expired";

export const DOCUMENT_STATE_STYLE: Record<
  DocumentState,
  { label: string; short: string; bg: string; border: string; text: string }
> = {
  /* The cell language the status sheet already uses, one level across: blank
     for nothing recorded, green for held, red for the one that stops you. */
  pending: {
    label: "Not done",
    short: "—",
    bg: "#ffffff",
    border: "#c8d2dc",
    text: "#5b6b7a",
  },
  done: {
    label: "Done",
    short: "Done",
    bg: "#8fce6a",
    border: "#4f9c2b",
    text: "#14400a",
  },
  expired: {
    label: "Expired",
    short: "Expired",
    bg: "#fae5e0",
    border: "#c6472f",
    text: "#c6472f",
  },
};

/** What a tap moves a document to. Three states, round and round. */
export function nextDocumentState(current: DocumentState): DocumentState {
  if (current === "pending") return "done";
  if (current === "done") return "expired";
  return "pending";
}

export type TravelStep = { key: string; label: string; short: string };

export type DocumentMap = Record<string, DocumentState>;
export type ChecklistMap = Record<string, boolean>;
export type TravelMap = Record<string, string | null>;

/**
 * Who set a joining item. `self` is true when the joiner marked their own row —
 * the crew member saying "done from my side" — as opposed to a supervisor or
 * the office putting the tick there.
 */
export type CrewMark = { byId: number; byName: string; self: boolean; at: string };
export type CrewMarks = Record<string, CrewMark>;

export type CrewProgress = {
  documentsDone: number;
  documentsTotal: number;
  documentsExpired: number;
  checklistDone: number;
  checklistTotal: number;
  travelDone: number;
  travelTotal: number;
  /** Everything asked for is answered and nothing is expired. */
  ready: boolean;
};

export type CrewMember = {
  id: number;
  vesselId: number;
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  /** The vessel's assigned supervisor — who joins like everybody else. */
  isSupervisor: boolean;
  documents: DocumentMap;
  checklist: ChecklistMap;
  travel: TravelMap;
  /** Who marked each set item, keyed "documents:passport". */
  marks: CrewMarks;
  notes: string | null;
  updatedByName: string | null;
  updatedAt: string;
  progress: CrewProgress;
};

/** The vessel, as far as somebody joining it needs to know. */
export type JoiningVessel = {
  id: number;
  reference: string;
  name: string;
  port: string;
  berth: string | null;
  destination: string | null;
  type: VesselType;
  status: VesselStatus;
  scheduledFor: string | null;
  /** Set once the gang is aboard. Null means the paperwork is still open. */
  holdReportedAt: string | null;
  crewDocuments: CrewItem[];
  crewChecklist: CrewItem[];
};

export type MyAssignment = { vessel: JoiningVessel; member: CrewMember };

/** The whole board for one vessel — what a supervisor works from. */
export type CrewBoard = {
  crew: CrewMember[];
  documents: CrewItem[];
  checklist: CrewItem[];
  travelSteps: TravelStep[];
  holdReportedAt: string | null;
  holdReportedByName: string | null;
};

/**
 * How far down the travel chain somebody has got.
 *
 * Read as "the last step with a time on it", not "how many are ticked": a
 * joiner who recorded boarding but forgot immigration is on the aircraft, and
 * counting ticks would report them still at the airport.
 */
export function travelStage(
  travel: TravelMap,
  steps: TravelStep[],
): { index: number; step: TravelStep | null } {
  let index = -1;
  for (let i = 0; i < steps.length; i += 1) {
    if (travel[steps[i].key]) index = i;
  }
  return { index, step: index >= 0 ? steps[index] : null };
}
