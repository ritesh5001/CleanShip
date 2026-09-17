"use client";

import { useEffect, useRef, useState } from "react";
import {
  CELL_STYLE,
  clampTime,
  clockOf,
  dateInputValue,
  fromDateAndTime,
  stampOf,
  timeInputValue,
  wallNow,
  type TimeKind,
  type TimeWindow,
} from "@/lib/cleantrack/types";

/**
 * Asks when a stage started or finished.
 *
 * The office half of the question the supervisor's app asks on every tap. It
 * exists here for the same reason it exists there: the tap and the work are
 * usually not the same moment. A hold finished at 02:10 gets entered when
 * somebody next has a free hand, and a silently assumed "now" is a wrong time
 * nobody notices until an invoice is disputed.
 *
 * Two native inputs rather than the app's wheels — a date and a time, both
 * bounded with `min`/`max` so the browser itself refuses anything outside the
 * window. A desk has a keyboard, and typing 0210 is faster than spinning to it.
 *
 * All arithmetic is on the UTC fields, which hold wall-clock time with no zone
 * attached (see wallNow). Local getters would re-apply the reader's own offset
 * and shift every time on the board.
 */
export function TimeAsk({
  open,
  title,
  kind,
  initial,
  bounds,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  /** "Hold No. 3 · HP Washing" — what is being timed. */
  title: string;
  kind: TimeKind;
  initial: Date;
  bounds: TimeWindow;
  onConfirm: (value: Date) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(() => dateInputValue(initial));
  const [time, setTime] = useState(() => timeInputValue(initial));
  const [error, setError] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

  /* Reset each time it opens for a different cell, or the last cell's time
     would be sitting there waiting to be confirmed by mistake. */
  useEffect(() => {
    if (!open) return;
    const start = clampTime(initial, bounds);
    setDate(dateInputValue(start));
    setTime(timeInputValue(start));
    setError(null);
    /* Focus the time, not the date: the date is nearly always right. */
    const t = setTimeout(() => firstField.current?.focus(), 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial, bounds.min, bounds.max]);

  /* Escape closes it. A modal that traps someone on a board they were mid-way
     through updating is worse than one that is easy to dismiss by accident. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const skin = CELL_STYLE[kind === "started" ? "in_progress" : "done"];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const picked = fromDateAndTime(date, time);
    if (!picked) {
      setError("Enter a date and a time.");
      return;
    }
    /* The browser enforces min/max on the controls, but a typed value can
       still land outside them, and this is the record an invoice is argued
       from — so it is checked here too rather than trusted. */
    if (picked.getTime() < bounds.min.getTime()) {
      setError(
        kind === "finished"
          ? `A finish cannot come before its start — the earliest is ${stampOf(bounds.min.toISOString())}.`
          : `The earliest this vessel allows is ${stampOf(bounds.min.toISOString())}.`,
      );
      return;
    }
    if (picked.getTime() > bounds.max.getTime()) {
      setError(
        kind === "started"
          ? `A start cannot come after its finish — the latest is ${stampOf(bounds.max.toISOString())}.`
          : `That is in the future. The latest is ${stampOf(bounds.max.toISOString())}.`,
      );
      return;
    }
    onConfirm(picked);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#06203a]/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${kind === "started" ? "Started" : "Finished"} — ${title}`}
    >
      {/* A sibling behind the panel, not its parent: a click-away wrapped
          around the form swallows the first click on a native date picker. */}
      <button
        type="button"
        aria-label="Close without saving"
        className="absolute inset-0 cursor-default"
        onClick={onCancel}
      />

      <form
        onSubmit={submit}
        className="relative w-full max-w-md border-t-[3px] border-[#1461a0] bg-white p-5 shadow-xl"
      >
        <p className="text-[15px] font-semibold text-slate-900">{title}</p>

        {/* Big, short, and in the status's own colour — so which of the two
            times is being answered is obvious before it is read. */}
        <span
          className={`mt-3 inline-block border-2 px-3 py-1 text-[20px] font-bold tracking-wider ${skin.cell}`}
        >
          {kind === "started" ? "STARTED" : "FINISHED"}
        </span>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Date
            </span>
            <input
              type="date"
              value={date}
              min={dateInputValue(bounds.min)}
              max={dateInputValue(bounds.max)}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              className="min-h-11 w-full rounded-none border border-slate-300 px-3 text-[15px] text-slate-900"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Time
            </span>
            <input
              ref={firstField}
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setError(null);
              }}
              className="min-h-11 w-full rounded-none border border-slate-300 px-3 text-[15px] tabular-nums text-slate-900"
            />
          </label>
        </div>

        {/* What is about to be written, spelled out. A date control is easy to
            leave a day off, and this is the line that catches it. */}
        <p className="mt-3 border border-slate-200 bg-[#f6f8fa] py-2 text-center text-[15px] font-semibold tabular-nums text-slate-900">
          {readback(date, time)}
        </p>

        <p className="mt-2 text-[11px] text-slate-500">
          Allowed: {stampOf(bounds.min.toISOString())} —{" "}
          {stampOf(bounds.max.toISOString())}
        </p>

        {error && (
          <p
            role="alert"
            className="mt-3 border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-none border border-slate-300 bg-white text-[14px] font-semibold text-slate-800 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-11 flex-1 rounded-none bg-[#1461a0] text-[14px] font-semibold text-white hover:bg-[#0e3d6b]"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

/** "Sun 14 Sep · 05:00", or a nudge while the pair is still incomplete. */
function readback(date: string, time: string) {
  const at = fromDateAndTime(date, time);
  if (!at) return "—";
  const today = wallNow();
  const sameDay =
    at.getUTCFullYear() === today.getUTCFullYear() &&
    at.getUTCMonth() === today.getUTCMonth() &&
    at.getUTCDate() === today.getUTCDate();
  return sameDay
    ? `Today · ${clockOf(at)}`
    : stampOf(at.toISOString()).replace(/ (\d{2}:\d{2})$/, " · $1");
}
