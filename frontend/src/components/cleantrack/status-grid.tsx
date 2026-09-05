"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VesselDiagram3D } from "./vessel-diagram-3d";
import { ProgressBar, StatusChip } from "./ui";
import {
  CELL_STATUSES,
  CELL_STYLE,
  compartmentNoun,
  formatDuration,
  formatWorkTime,
  compartmentState,
  nextStatusOnTap,
  progressOf,
  type CellStatus,
  type Stage,
  type VesselType,
} from "@/lib/cleantrack/types";

/**
 * The status sheet, on a phone.
 *
 * This is the screen the whole system exists for: the grid of holds × stages
 * that used to be a printed table on a clipboard. A supervisor taps a cell to
 * move it on — blank, yellow, green — and opens a compartment below to set
 * "not applicable" or leave a note like "Water in tank".
 */

export type GridCompartment = {
  id: number;
  label: string;
  position: number;
  notes: string | null;
  cells: Record<
    string,
    {
      status: CellStatus;
      note: string | null;
      startedAt?: string | null;
      completedAt?: string | null;
    }
  >;
};

type QueuedChange = {
  key: string;
  compartmentId: number;
  stageKey: string;
  status: CellStatus;
  note?: string | null;
  occurredAt: string;
};

const QUEUE_KEY = "cleantrack.queue.v2";

/* -------------------------------------------------------------------- */
/* Offline queue                                                        */
/*                                                                      */
/* A supervisor at a berth loses signal constantly — inside a hold,      */
/* behind a shed, mid-harbour. If a tap is lost the paper sheet wins and */
/* this whole system is pointless, so every tap is written to            */
/* localStorage FIRST and only then sent. The UI updates immediately     */
/* from local state; the network is a background concern.                */
/*                                                                      */
/* localStorage rather than IndexedDB: the payload is a handful of tiny  */
/* records, it is synchronous (so a tap cannot be lost to an await that  */
/* never resolves because the page was backgrounded), and it survives a  */
/* browser kill. IndexedDB would be right only if photos were queued too. */
/* -------------------------------------------------------------------- */

function readQueue(): QueuedChange[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeQueue(q: QueuedChange[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* Private mode or a full quota. In-memory state still works for this
       session; we just cannot survive a reload. Better than throwing on tap. */
  }
}

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/* -------------------------------------------------------------------- */

export function StatusGrid({
  vesselId,
  vesselType,
  stages,
  initialCompartments,
  initialVersion,
  readOnly = false,
}: {
  vesselId: number;
  vesselType: VesselType;
  /** The vessel's own stage list. Never a hardcoded preset. */
  stages: Stage[];
  initialCompartments: GridCompartment[];
  initialVersion: number;
  /** Admins viewing someone else's vessel, and customers, get it read-only. */
  readOnly?: boolean;
}) {
  const [comps, setComps] = useState(initialCompartments);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialCompartments[0]?.id ?? null,
  );
  const [queue, setQueue] = useState<QueuedChange[]>([]);
  const [online, setOnline] = useState(true);
  const [version, setVersion] = useState(initialVersion);

  const selected = comps.find((c) => c.id === selectedId) ?? null;

  /* ---- connectivity ---- */
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    setQueue(readQueue());
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  /* ---- flush the queue ---- */
  const flush = useCallback(async () => {
    const pending = readQueue();
    if (pending.length === 0 || !navigator.onLine) return;

    /* Sent as one batch: a supervisor who marked a whole hold offline has six
       changes waiting, and six requests over a dock connection is six chances
       to lose half of them. */
    try {
      const res = await fetch("/api/cleantrack/cells", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          vesselId,
          changes: pending.map((c) => ({
            compartmentId: c.compartmentId,
            stageKey: c.stageKey,
            status: c.status,
            note: c.note,
            occurredAt: c.occurredAt,
            idempotencyKey: c.key,
          })),
        }),
      });

      if (res.ok) {
        const body = await res.json();
        if (typeof body.version === "number") setVersion(body.version);
        const sent = new Set(pending.map((c) => c.key));
        const rest = readQueue().filter((c) => !sent.has(c.key));
        writeQueue(rest);
        setQueue(rest);
        return;
      }

      if (res.status < 500) {
        /* A 4xx will never succeed on retry — a deleted compartment, a revoked
           session, a vessel reassigned. Drop the batch rather than retrying
           forever, but keep local state so the supervisor still sees their own
           work and can tell someone about it. */
        const sent = new Set(pending.map((c) => c.key));
        const rest = readQueue().filter((c) => !sent.has(c.key));
        writeQueue(rest);
        setQueue(rest);
      }
    } catch {
      /* Network died mid-flush. Everything still queued; try again later. */
    }
  }, [vesselId]);

  useEffect(() => {
    if (readOnly) return;
    void flush();
    const t = setInterval(() => void flush(), 15_000);
    window.addEventListener("online", flush);
    return () => {
      clearInterval(t);
      window.removeEventListener("online", flush);
    };
  }, [flush, readOnly]);

  /* ---- poll for other people's changes ---- */
  useEffect(() => {
    const t = setInterval(async () => {
      /* Never overwrite local state while our own taps are still in flight —
         the server has not seen them and would hand back a stale board. */
      if (readQueue().length > 0) return;
      try {
        const res = await fetch(`/api/cleantrack/vessels/${vesselId}/state`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const body = await res.json();
        if (body.version !== version) {
          setComps(body.compartments);
          setVersion(body.version);
        }
      } catch {
        /* Offline. The next tick will catch up. */
      }
    }, 10_000);
    return () => clearInterval(t);
  }, [vesselId, version]);

  /* ---- the write ---- */
  const setCell = useCallback(
    (
      compartmentId: number,
      stageKey: string,
      status: CellStatus,
      note?: string | null,
    ) => {
      if (readOnly) return;

      /* Optimistic: the grid moves the instant a thumb lands on it. */
      const now = new Date().toISOString();
      setComps((prev) =>
        prev.map((c) => {
          if (c.id !== compartmentId) return c;
          const existing = c.cells[stageKey];

          /* Mirror the API's own rules so the board does not disagree with
             the server a second later. See resolveTimes in the backend. */
          let startedAt = existing?.startedAt ?? null;
          let completedAt = existing?.completedAt ?? null;
          if (status === "pending" || status === "na") {
            startedAt = null;
            completedAt = null;
          } else if (status === "in_progress") {
            startedAt = startedAt ?? now;
            completedAt = null;
          } else if (status === "done") {
            completedAt = completedAt ?? now;
          }

          return {
            ...c,
            cells: {
              ...c.cells,
              [stageKey]: {
                status,
                note: note === undefined ? (existing?.note ?? null) : note,
                startedAt,
                completedAt,
              },
            },
          };
        }),
      );

      const change: QueuedChange = {
        key: newKey(),
        compartmentId,
        stageKey,
        status,
        note,
        occurredAt: new Date().toISOString(),
      };
      const next = [...readQueue(), change];
      writeQueue(next);
      setQueue(next);
      void flush();
    },
    [flush, readOnly],
  );

  /** One tap on a column heading: the whole stage, every compartment. */
  const setColumn = useCallback(
    (stageKey: string, status: CellStatus) => {
      if (readOnly) return;
      for (const c of comps) {
        if (c.cells[stageKey]?.status === "na") continue;
        setCell(c.id, stageKey, status);
      }
    },
    [comps, readOnly, setCell],
  );

  const overall = useMemo(
    () =>
      progressOf(
        comps.flatMap((c) => stages.map((s) => c.cells[s.key]?.status ?? "pending")),
      ),
    [comps, stages],
  );

  return (
    <div className="space-y-5">
      {!readOnly && <SyncBanner online={online} pending={queue.length} />}

      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {compartmentNoun(vesselType, true)}
          </h2>
          <span className="font-mono text-[13px] text-slate-500">
            {Math.round(overall.ratio * 100)}%
          </span>
        </div>
        <ProgressBar ratio={overall.ratio} />
        <VesselDiagram3D
          className="mt-4"
          compartments={comps}
          stages={stages}
          vesselType={vesselType}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <Grid
        comps={comps}
        stages={stages}
        vesselType={vesselType}
        selectedId={selectedId}
        readOnly={readOnly}
        onSelect={setSelectedId}
        onTapCell={(compartmentId, stageKey, current) =>
          setCell(compartmentId, stageKey, nextStatusOnTap(current))
        }
        onTapColumn={setColumn}
      />

      {selected && (
        <CompartmentPanel
          key={selected.id}
          compartment={selected}
          stages={stages}
          readOnly={readOnly}
          onSet={setCell}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */

function SyncBanner({ online, pending }: { online: boolean; pending: number }) {
  if (online && pending === 0) return null;

  const offline = !online;
  return (
    <div
      role="status"
      className={`rounded-lg border px-4 py-3 text-[14px] ${
        offline
          ? "border-amber-400 bg-amber-50 text-amber-900"
          : "border-blue-300 bg-blue-50 text-blue-900"
      }`}
    >
      {offline ? (
        <>
          <strong className="font-semibold">Offline.</strong> Your taps are saved
          on this phone{pending > 0 ? ` (${pending} waiting)` : ""} and will sync
          by themselves when the signal returns. Keep working.
        </>
      ) : (
        <>
          <strong className="font-semibold">Syncing…</strong> {pending} update
          {pending === 1 ? "" : "s"} still to send.
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */

/**
 * The grid itself — deliberately the same shape as the printed sheet, so a
 * supervisor who has used the paper version needs no explanation.
 */
function Grid({
  comps,
  stages,
  vesselType,
  selectedId,
  readOnly,
  onSelect,
  onTapCell,
  onTapColumn,
}: {
  comps: GridCompartment[];
  stages: Stage[];
  vesselType: VesselType;
  selectedId: number | null;
  readOnly: boolean;
  onSelect: (id: number) => void;
  onTapCell: (compartmentId: number, stageKey: string, current: CellStatus) => void;
  onTapColumn: (stageKey: string, status: CellStatus) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[560px] border-collapse text-[13px]">
        <caption className="sr-only">
          Cleaning status by {compartmentNoun(vesselType).toLowerCase()} and stage
        </caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th scope="col" className="px-3 py-2.5 text-left font-semibold text-slate-700">
              {compartmentNoun(vesselType)}
            </th>
            {stages.map((s) => (
              <th
                key={s.key}
                scope="col"
                className="px-1 py-2.5 text-center font-semibold text-slate-700"
              >
                {readOnly ? (
                  <span title={s.label}>{s.short}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onTapColumn(s.key, "done")}
                    title={`Mark ${s.label} done on every ${compartmentNoun(vesselType).toLowerCase()}`}
                    className="w-full rounded px-1 py-1 hover:bg-slate-200"
                  >
                    {s.short}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comps.map((c) => (
            <tr
              key={c.id}
              className={`border-b border-slate-100 last:border-0 ${
                selectedId === c.id ? "bg-blue-50" : ""
              }`}
            >
              <th scope="row" className="px-1 py-1 text-left">
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className="w-full rounded px-2 py-2 text-left font-semibold text-slate-900 hover:bg-slate-100"
                >
                  {c.label}
                </button>
              </th>
              {stages.map((s) => {
                const cell = c.cells[s.key] ?? { status: "pending" as CellStatus, note: null };
                const style = CELL_STYLE[cell.status];
                const label = `${c.label}, ${s.label}: ${style.label}${
                  cell.note ? ` — ${cell.note}` : ""
                }`;
                return (
                  <td key={s.key} className="p-0.5">
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => onTapCell(c.id, s.key, cell.status)}
                      aria-label={label}
                      title={label}
                      className={`flex min-h-11 w-full items-center justify-center rounded border px-1 text-[11px] font-semibold leading-tight ${style.cell} ${
                        readOnly ? "cursor-default" : "hover:brightness-95 active:brightness-90"
                      }`}
                    >
                      {cell.note ? (
                        <span className="line-clamp-2">{cell.note}</span>
                      ) : cell.status === "pending" ? (
                        ""
                      ) : (
                        style.short
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------- */

/**
 * One compartment in full: every stage with all four states spelled out, plus
 * the note field. The grid is for speed; this is for the cases the grid cannot
 * express with a tap.
 */
function CompartmentPanel({
  compartment,
  stages,
  readOnly,
  onSet,
}: {
  compartment: GridCompartment;
  stages: Stage[];
  readOnly: boolean;
  onSet: (
    compartmentId: number,
    stageKey: string,
    status: CellStatus,
    note?: string | null,
  ) => void;
}) {
  /* `cells` here carries only status and note — the API's fuller cell shape is
     not needed to read a status, and asking for it would make this component
     depend on fields it never renders. */
  const statuses = stages.map(
    (s) => compartment.cells[s.key]?.status ?? ("pending" as CellStatus),
  );
  const state = compartmentState(statuses);
  const { done, total } = progressOf(statuses);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{compartment.label}</h2>
          <p className="mt-0.5 text-[13px] text-slate-600">
            {done} of {total} stages done
          </p>
        </div>
        <StatusChip state={state} />
      </div>

      <ul className="divide-y divide-slate-100">
        {stages.map((stage) => {
          const cell = compartment.cells[stage.key] ?? {
            status: "pending" as CellStatus,
            note: null,
          };
          return (
            <li key={stage.key} className="px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[15px] font-semibold text-slate-900">
                  {stage.label}
                </span>
                <div className="flex flex-wrap gap-1" role="group" aria-label={stage.label}>
                  {CELL_STATUSES.map((status) => {
                    const active = cell.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={readOnly}
                        aria-pressed={active}
                        onClick={() => onSet(compartment.id, stage.key, status)}
                        className={`min-h-9 rounded-md border px-2.5 text-[12px] font-semibold transition-colors ${
                          active
                            ? CELL_STYLE[status].cell
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        } ${readOnly ? "cursor-default" : ""}`}
                      >
                        {CELL_STYLE[status].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* When the work actually happened, as opposed to when it was
                  recorded. Read-only here: correcting a time is a job for the
                  supervisor on the vessel, in the app, where they know what
                  the deck was doing. */}
              <p className="mt-1.5 text-[12px] text-slate-500">
                <span className="font-medium text-slate-600">Started</span>{" "}
                {formatWorkTime(cell.startedAt)}
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="font-medium text-slate-600">Finished</span>{" "}
                {formatWorkTime(cell.completedAt)}
                {formatDuration(cell.startedAt, cell.completedAt) && (
                  <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-800">
                    {formatDuration(cell.startedAt, cell.completedAt)}
                  </span>
                )}
              </p>

              {!readOnly && (
                <NoteField
                  value={cell.note ?? ""}
                  placeholder="Add a note — e.g. water in tank"
                  onCommit={(note) =>
                    onSet(compartment.id, stage.key, cell.status, note || null)
                  }
                />
              )}
              {readOnly && cell.note && (
                <p className="mt-1.5 text-[13px] text-slate-600">{cell.note}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * A note that saves on blur rather than on every keystroke — one queued change
 * per note, not one per letter typed on a flaky connection.
 */
function NoteField({
  value,
  placeholder,
  onCommit,
}: {
  value: string;
  placeholder: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft.trim() !== value.trim()) onCommit(draft.trim());
      }}
      maxLength={160}
      placeholder={placeholder}
      className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2 text-[13px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
    />
  );
}
