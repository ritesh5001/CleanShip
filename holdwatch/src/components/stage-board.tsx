"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VesselDiagram } from "./vessel-diagram";
import { ProgressBar, StatusChip } from "./ui";
import {
  compartmentNoun,
  nextStage,
  progressOf,
  stagesFor,
  stateOf,
  type JobType,
} from "@/lib/stages";

export type BoardCompartment = {
  id: number;
  label: string;
  position: number;
  completed: string[];
};

type QueuedChange = {
  key: string;
  compartmentId: number;
  stageKey: string;
  done: boolean;
  occurredAt: string;
};

const QUEUE_KEY = "holdwatch.queue.v1";

/* -------------------------------------------------------------------- */
/* Offline queue                                                         */
/*                                                                       */
/* A supervisor at a berth loses signal constantly — inside a hold, behind */
/* a shed, mid-harbour. If a tap is lost the paper sheet wins and this     */
/* whole system is pointless, so every tap is written to localStorage      */
/* FIRST and only then sent. The UI updates immediately from local state;  */
/* the network is a background concern.                                    */
/*                                                                        */
/* localStorage rather than IndexedDB: the payload is a handful of tiny    */
/* records, it is synchronous (so a tap cannot be lost to an await that    */
/* never resolves because the page was backgrounded), and it survives a    */
/* browser kill. IndexedDB would be the right call only if photos were     */
/* queued too — which is Phase 3.                                          */
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
    /* Private mode or a full quota. The in-memory state still works for this
       session; we just cannot survive a reload. Better than throwing on tap. */
  }
}

export function StageBoard({
  jobId,
  jobType,
  initialCompartments,
  initialVersion,
  readOnly = false,
}: {
  jobId: number;
  jobType: JobType;
  initialCompartments: BoardCompartment[];
  initialVersion: number;
  /** Clients and admins viewing someone else's job get the board read-only. */
  readOnly?: boolean;
}) {
  const [comps, setComps] = useState(initialCompartments);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialCompartments[0]?.id ?? null,
  );
  const [queue, setQueue] = useState<QueuedChange[]>([]);
  const [online, setOnline] = useState(true);
  const [version, setVersion] = useState(initialVersion);

  const stages = useMemo(() => stagesFor(jobType), [jobType]);
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

    for (const change of pending) {
      try {
        const res = await fetch("/api/stage", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jobId, ...change, idempotencyKey: change.key }),
        });
        if (!res.ok && res.status < 500) {
          /* A 4xx will never succeed on retry — a deleted compartment, a
             revoked session. Drop it rather than retrying forever, but keep
             the local state so the supervisor still sees their own work. */
          const rest = readQueue().filter((c) => c.key !== change.key);
          writeQueue(rest);
          setQueue(rest);
          continue;
        }
        if (res.ok) {
          const body = await res.json();
          if (typeof body.version === "number") setVersion(body.version);
          const rest = readQueue().filter((c) => c.key !== change.key);
          writeQueue(rest);
          setQueue(rest);
        }
      } catch {
        /* Network died mid-flush. Everything still queued; try again later. */
        break;
      }
    }
  }, [jobId]);

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
      /* Do not overwrite local state while our own taps are still in flight —
         the server has not seen them yet and would hand back a stale board. */
      if (readQueue().length > 0) return;
      try {
        const res = await fetch(`/api/jobs/${jobId}/state`, { cache: "no-store" });
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
  }, [jobId, version]);

  /* ---- the tap ---- */
  const toggle = useCallback(
    (compartmentId: number, stageKey: string, done: boolean) => {
      if (readOnly) return;

      /* Optimistic: the board moves the instant a thumb lands on it. */
      setComps((prev) =>
        prev.map((c) => {
          if (c.id !== compartmentId) return c;
          const set = new Set(c.completed);
          if (done) set.add(stageKey);
          else set.delete(stageKey);
          return {
            ...c,
            completed: stagesFor(jobType)
              .map((s) => s.key)
              .filter((k) => set.has(k)),
          };
        }),
      );

      const change: QueuedChange = {
        key:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        compartmentId,
        stageKey,
        done,
        occurredAt: new Date().toISOString(),
      };

      const next = [...readQueue(), change];
      writeQueue(next);
      setQueue(next);
      void flush();
    },
    [flush, jobType, readOnly],
  );

  const jobDone = comps.reduce(
    (n, c) => n + progressOf(c.completed, jobType).done,
    0,
  );
  const jobTotal = stages.length * comps.length;

  return (
    <div className="space-y-5">
      {!readOnly && <SyncBanner online={online} pending={queue.length} />}

      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {compartmentNoun(jobType, true)}
          </h2>
          <span className="font-mono text-[13px] text-slate-500">
            {jobTotal === 0 ? 0 : Math.round((jobDone / jobTotal) * 100)}%
          </span>
        </div>
        <ProgressBar ratio={jobTotal === 0 ? 0 : jobDone / jobTotal} />
        <VesselDiagram
          className="mt-4"
          compartments={comps}
          jobType={jobType}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {selected && (
        <ChecklistPanel
          compartment={selected}
          jobType={jobType}
          readOnly={readOnly}
          onToggle={toggle}
        />
      )}

      <CompartmentTable
        comps={comps}
        jobType={jobType}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
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
          <strong className="font-semibold">Offline.</strong> Your taps are
          saved on this phone
          {pending > 0 ? ` (${pending} waiting)` : ""} and will sync by
          themselves when the signal returns. Keep working.
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

function ChecklistPanel({
  compartment,
  jobType,
  readOnly,
  onToggle,
}: {
  compartment: BoardCompartment;
  jobType: JobType;
  readOnly: boolean;
  onToggle: (id: number, stage: string, done: boolean) => void;
}) {
  const stages = stagesFor(jobType);
  const state = stateOf(compartment.completed, jobType);
  const next = nextStage(compartment.completed, jobType);
  const { done, total } = progressOf(compartment.completed, jobType);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {compartment.label}
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-600">
            {done} of {total} stages complete
          </p>
        </div>
        <StatusChip state={state} />
      </div>

      <ul className="divide-y divide-slate-100">
        {stages.map((stage) => {
          const isDone = compartment.completed.includes(stage.key);
          const isNext = next?.key === stage.key;
          return (
            <li key={stage.key}>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onToggle(compartment.id, stage.key, !isDone)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors sm:px-5 ${
                  readOnly
                    ? "cursor-default"
                    : "active:bg-slate-100 hover:bg-slate-50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-[15px] font-bold ${
                    isDone
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isNext
                        ? "border-amber-500 text-amber-600"
                        : "border-slate-300 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="flex-1">
                  <span
                    className={`block text-[16px] font-semibold ${
                      isDone ? "text-slate-500 line-through" : "text-slate-900"
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isNext && !readOnly && (
                    <span className="mt-0.5 block text-[12px] font-medium text-amber-700">
                      Next up
                    </span>
                  )}
                </span>
                {!readOnly && (
                  <span className="shrink-0 text-[13px] font-semibold text-blue-700">
                    {isDone ? "Undo" : "Mark done"}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CompartmentTable({
  comps,
  jobType,
  selectedId,
  onSelect,
}: {
  comps: BoardCompartment[];
  jobType: JobType;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const stages = stagesFor(jobType);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[560px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            <th className="px-4 py-3 font-semibold text-slate-700">
              {compartmentNoun(jobType)}
            </th>
            {stages.map((s) => (
              <th
                key={s.key}
                className="px-2 py-3 text-center font-semibold text-slate-700"
              >
                {s.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comps.map((c) => (
            <tr
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`cursor-pointer border-b border-slate-100 last:border-0 ${
                selectedId === c.id ? "bg-blue-50" : "hover:bg-slate-50"
              }`}
            >
              <th
                scope="row"
                className="px-4 py-3 text-left font-semibold text-slate-900"
              >
                {c.label}
              </th>
              {stages.map((s) => {
                const done = c.completed.includes(s.key);
                return (
                  <td key={s.key} className="px-2 py-3 text-center">
                    <span
                      className={`inline-block size-4 rounded-[3px] border ${
                        done
                          ? "border-emerald-600 bg-emerald-500"
                          : "border-slate-300 bg-white"
                      }`}
                      aria-label={done ? `${s.label} complete` : `${s.label} not done`}
                      role="img"
                    />
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
