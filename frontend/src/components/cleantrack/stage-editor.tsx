"use client";

import { useActionState, useState } from "react";
import { setStagesAction } from "@/app/cleantrack/admin/actions";
import type { Stage } from "@/lib/cleantrack/types";

/**
 * The per-vessel stage list, edited in place.
 *
 * This used to be a modal. It is the fiddliest thing in the console and the
 * one most often got wrong — a tanker created on the hold preset, a bilges
 * stage on a vessel with no bilge wells — and a modal is the worst place to
 * get something right, because it hides the grid you are checking against.
 * On the page, beside the grid, the two can be read together.
 *
 * Reordering is buttons rather than drag: a drag target is a poor one on a
 * trackpad, invisible to a keyboard, and this list is six rows long.
 */

type Props = {
  vesselId: number;
  stages: Stage[];
  /** The preset for this vessel's type, for "Reset to preset". */
  preset?: Stage[] | null;
};

/** A label with no key yet is new; the API assigns the key on save. */
type Draft = { key?: string; label: string; short: string };

export function StageEditor({ vesselId, stages, preset }: Props) {
  const [rows, setRows] = useState<Draft[]>(() =>
    stages.map((s) => ({ key: s.key, label: s.label, short: s.short })),
  );
  const [state, formAction, saving] = useActionState(setStagesAction, {});

  const dirty =
    rows.length !== stages.length ||
    rows.some(
      (r, i) => r.label !== stages[i]?.label || r.short !== stages[i]?.short,
    );

  function move(i: number, by: number) {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  }

  function update(i: number, patch: Partial<Draft>) {
    setRows(rows.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="vesselId" value={vesselId} />
      <input type="hidden" name="stages" value={JSON.stringify(rows)} />

      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Stages
        </h2>
        <span className="font-mono text-[11px] text-slate-400">
          {rows.length} per this vessel
        </span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {rows.map((row, i) => (
          <li
            key={row.key ?? `new-${i}`}
            className="flex items-center gap-2 rounded-none border border-slate-200 bg-white px-2 py-2"
          >
            <span aria-hidden="true" className="select-none text-slate-300">
              ⠿
            </span>
            <span className="w-4 shrink-0 text-center font-mono text-[11px] text-slate-400">
              {i + 1}
            </span>

            <input
              value={row.label}
              onChange={(e) => update(i, { label: e.target.value })}
              aria-label={`Stage ${i + 1} name`}
              className="min-w-0 flex-1 rounded-none border border-transparent px-1 py-1 text-[14px] text-slate-900 hover:border-slate-200 focus:border-[#1461a0] focus:outline-none"
            />
            <input
              value={row.short}
              onChange={(e) => update(i, { short: e.target.value })}
              aria-label={`Stage ${i + 1} short label`}
              className="w-20 shrink-0 rounded-none border border-transparent px-1 py-1 text-right font-mono text-[12px] text-slate-500 hover:border-slate-200 focus:border-[#1461a0] focus:outline-none"
            />

            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${row.label} up`}
                className="px-1 text-slate-400 hover:text-[#1461a0] disabled:opacity-25"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                aria-label={`Move ${row.label} down`}
                className="px-1 text-slate-400 hover:text-[#1461a0] disabled:opacity-25"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => setRows(rows.filter((_, k) => k !== i))}
                disabled={rows.length === 1}
                aria-label={`Remove ${row.label}`}
                className="px-1 text-slate-400 hover:text-[#c6472f] disabled:opacity-25"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setRows([...rows, { label: "New stage", short: "New" }])}
        className="h-11 w-full rounded-none border border-dashed border-[#b9c5cf] text-[13px] font-semibold text-[#1461a0] hover:border-[#1461a0]"
      >
        + Add stage
      </button>

      <div className="flex flex-wrap items-center gap-3">
        {preset && preset.length > 0 && (
          <button
            type="button"
            onClick={() =>
              setRows(preset.map((s) => ({ key: s.key, label: s.label, short: s.short })))
            }
            className="text-[13px] text-slate-500 hover:underline"
          >
            Reset to preset
          </button>
        )}
      </div>

      {/* Changing the stage list changes every compartment's denominator, so
          it saves on an explicit press rather than on each keystroke. */}
      <button
        type="submit"
        disabled={!dirty || saving}
        className="h-11 rounded-none border border-[#0e3d6b] bg-[#1461a0] px-4 text-[13px] font-semibold text-white disabled:opacity-40"
      >
        {saving ? "Saving…" : "Save stages"}
      </button>

      {state.error && (
        <p className="m-0 text-[13px] text-[#c6472f]">{state.error}</p>
      )}
      {state.ok && !dirty && (
        <p className="m-0 text-[13px] text-[#1e9e63]">{state.ok}</p>
      )}
    </form>
  );
}
