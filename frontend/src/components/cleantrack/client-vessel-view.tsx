"use client";

import { useState } from "react";
import { VesselDiagramStatic } from "./vessel-diagram-static";
import { LiveRefresh } from "./live-refresh";
import { Reveal, ScrollStage } from "./scroll-stage";
import { formatDate, formatDateTime, relativeTime } from "@/lib/format";
import {
  CELL_STYLE_DARK,
  STATE_STYLE_DARK,
  compartmentNoun,
  formatDuration,
  formatWorkTime,
  progressOf,
  statusesOf,
  type PublicVessel,
} from "@/lib/cleantrack/types";

/**
 * The customer's view of a vessel.
 *
 * Read-only by construction: there is no handler anywhere in this tree, so no
 * future edit can accidentally make a customer's screen writable.
 *
 * DARK, AND THE VESSEL IS THE PAGE
 *
 * The office board is a working tool and stays light. This is the one screen a
 * paying customer sees, usually once, often on a phone, to answer a single
 * question — is my ship ready. So the vessel is not a diagram in a card
 * halfway down; it is the first thing, full bleed, with the readings emerging
 * out of the scrim beneath it. Everything else is arranged around that.
 *
 * The status colours are the dark tonal variants, not the light ones dropped
 * onto a dark ground — see STATE_STYLE_DARK for why that distinction matters.
 */
export function ClientVesselView({
  vessel,
  live = true,
}: {
  vessel: PublicVessel;
  /** Off for a finished vessel — there is nothing left to poll for. */
  live?: boolean;
}) {
  const { stages, progress } = vessel;
  const noun = compartmentNoun(vessel.type, true).toLowerCase();
  const pct = Math.round(progress.ratio * 100);

  /* Drives the camera's flight. Held here rather than inside the stage so the
     caption overlay can react to the same number, which is what makes the
     words feel attached to the shot instead of scrolling past it. */
  const [shot, setShot] = useState(0);

  /* Three beats across the flight, each holding while its part of the ship is
     on screen. Kept as plain thresholds: a timeline for three captions would
     be more machinery than the job needs. */
  const beat = shot < 0.34 ? 0 : shot < 0.7 ? 1 : 2;
  const beats = [
    {
      k: "The vessel",
      v: `${vessel.compartments.length} ${noun} under survey`,
    },
    {
      k: "The work",
      v: `${progress.compartmentsComplete} ready, ${
        vessel.compartments.filter((c) => c.state === "in-progress").length
      } in progress`,
    },
    { k: "Right now", v: `${pct}% complete` },
  ];

  return (
    <div className="space-y-10">
      {/* ---------------------------------------------------------------- */}
      {/* Hero: the vessel, and the one number that answers the question.   */}
      {/* ---------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------- */}
      {/* The flight. The stage pins, the camera moves through the ship,     */}
      {/* and the captions change with it. Scroll IS the camera.             */}
      {/* ---------------------------------------------------------------- */}
      <ScrollStage heightVh={300} onProgress={setShot}>
        <div className="relative h-full w-full">
          {/* Ambient light, fixed behind the scene. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(65% 55% at 25% 15%, rgba(56,189,248,0.16), transparent 70%), radial-gradient(50% 50% at 82% 80%, rgba(34,197,94,0.10), transparent 70%)",
            }}
          />

          {/* The ship, filling the stage. */}
          <div className="absolute inset-0">
            <VesselDiagramStatic
              className="h-full"
              compartments={vessel.compartments.map((c) => ({
                id: c.id,
                label: c.label,
                position: c.position,
                cells: c.cells,
              }))}
              stages={stages}
              vesselType={vessel.type}
              palette={STATE_STYLE_DARK}
              scrollShot={shot}
            />
          </div>

          {/* Scrims top and bottom: the words sit on darkness, not on the
              hull, which is what keeps them readable at every frame of the
              flight rather than only at the ones we happened to check. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[#060b14] via-[#060b14]/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#060b14] via-[#060b14]/85 to-transparent"
          />

          {/* Identity, always on. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-7 sm:px-10 sm:pt-10">
            <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.3em] text-sky-300/70">
                  {vessel.reference}
                </p>
                <h1 className="mt-2 truncate font-[family-name:var(--font-display)] text-[34px] font-bold leading-none tracking-tight text-white sm:text-[52px]">
                  {vessel.name}
                </h1>
                <p className="mt-2 text-[13px] text-slate-400">
                  {vessel.port}
                  {vessel.berth ? ` · ${vessel.berth}` : ""}
                  {vessel.imo ? ` · IMO ${vessel.imo}` : ""}
                </p>
              </div>
              {live && vessel.status !== "complete" && (
                <div className="pointer-events-auto">
                  <LiveRefresh dark />
                </div>
              )}
            </div>
          </div>

          {/* The caption, changing with the shot. Crossfaded rather than
              swapped, so a beat change reads as the film moving on. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-9 sm:px-10 sm:pb-12">
            <div className="mx-auto max-w-5xl">
              <div className="relative h-[92px] sm:h-[104px]">
                {beats.map((b, i) => (
                  <div
                    key={b.k}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      opacity: beat === i ? 1 : 0,
                      transform: `translateY(${beat === i ? 0 : 12}px)`,
                    }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300/80">
                      {b.k}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight text-white sm:text-[34px]">
                      {b.v}
                    </p>
                  </div>
                ))}
              </div>

              {/* The progress line doubles as the scroll indicator: it fills
                  with the flight, so the visitor can see how much is left of
                  both the shot and the job. */}
              <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background:
                      pct === 100
                        ? "linear-gradient(90deg,#34d399,#4ade80)"
                        : "linear-gradient(90deg,#f59e0b,#fbbf24)",
                  }}
                />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-[12px] uppercase tracking-[0.16em] text-slate-500">
                  {progress.compartmentsComplete}/{progress.compartmentsTotal}{" "}
                  {noun} ready
                </p>
                <p className="font-mono text-[24px] font-semibold leading-none text-emerald-300 tabular-nums sm:text-[30px]">
                  {pct}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollStage>

      {/* ---------------------------------------------------------------- */}
      {/* The four facts a customer actually asks for.                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: "Cleaning", v: compartmentNoun(vessel.type, true) },
          { k: "Scheduled", v: formatDate(vessel.scheduledFor) },
          {
            k: "Started",
            v: vessel.startedAt ? formatDateTime(vessel.startedAt) : "Not started",
          },
          { k: "Last update", v: relativeTime(vessel.updatedAt) },
        ].map((row, i) => (
          <Reveal
            key={row.k}
            stagger={i * 0.07}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-white/20"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              {row.k}
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-slate-100">
              {row.v}
            </p>
          </Reveal>
        ))}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Hold by hold. A table on desktop, cards on a phone.               */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-[26px] font-bold text-white sm:text-[32px]">
            Stage by stage
          </h2>
          <p className="mt-1.5 text-[14px] text-slate-400">
            Every {compartmentNoun(vessel.type).toLowerCase()}, and when the
            crew worked it.
          </p>
        </Reveal>

        {/* Desktop: the full matrix. */}
        <Reveal className="mt-5 hidden overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] lg:block">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left font-semibold text-slate-300">
                  {compartmentNoun(vessel.type)}
                </th>
                {stages.map((s) => (
                  <th
                    key={s.key}
                    className="px-2 py-3 text-center font-semibold text-slate-400"
                  >
                    {s.short}
                  </th>
                ))}
                <th className="px-3 py-3 text-left font-semibold text-slate-400">
                  Started
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-400">
                  Finished
                </th>
              </tr>
            </thead>
            <tbody>
              {vessel.compartments.map((c) => {
                const statuses = statusesOf(c, stages);
                const { done, total } = progressOf(statuses);
                const state = STATE_STYLE_DARK[c.state];
                return (
                  <tr
                    key={c.id}
                    className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03]"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 text-left"
                    >
                      <span className="font-semibold text-slate-100">
                        {c.label}
                      </span>
                      <span className="ml-2 font-mono text-[11px] text-slate-500">
                        {total === 0 ? "N/A" : `${done}/${total}`}
                      </span>
                      <span
                        className={`ml-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${state.chip}`}
                      >
                        {state.label}
                      </span>
                    </th>
                    {stages.map((s) => {
                      const cell = c.cells[s.key];
                      const status = cell?.status ?? "pending";
                      const style = CELL_STYLE_DARK[status];
                      return (
                        <td key={s.key} className="px-1.5 py-2 text-center">
                          <span
                            title={cell?.note ?? style.label}
                            aria-label={`${s.label}: ${style.label}${cell?.note ? ` — ${cell.note}` : ""}`}
                            className={`inline-flex min-h-7 w-full items-center justify-center rounded-md border px-1.5 text-[11px] font-semibold ${style.cell}`}
                          >
                            {cell?.note ?? style.short}
                          </span>
                        </td>
                      );
                    })}
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-slate-300">
                      {formatWorkTime(c.startedAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-slate-300">
                      {formatWorkTime(c.completedAt)}
                      {formatDuration(c.startedAt, c.completedAt) && (
                        <span className="ml-1.5 rounded bg-sky-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                          {formatDuration(c.startedAt, c.completedAt)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        {/* Phone: one card per compartment. A ten-column matrix on a 375px
            screen is a horizontal scroll nobody performs. */}
        <div className="mt-5 space-y-3 lg:hidden">
          {vessel.compartments.map((c, i) => {
            const statuses = statusesOf(c, stages);
            const { done, total } = progressOf(statuses);
            const state = STATE_STYLE_DARK[c.state];
            return (
              <Reveal
                key={c.id}
                stagger={Math.min(i, 5) * 0.05}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-100">{c.label}</p>
                    <p className="mt-0.5 font-mono text-[12px] text-slate-500">
                      {total === 0 ? "Not applicable" : `${done}/${total} stages`}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${state.chip}`}
                  >
                    {state.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {stages.map((s) => {
                    const cell = c.cells[s.key];
                    const status = cell?.status ?? "pending";
                    const style = CELL_STYLE_DARK[status];
                    return (
                      <span
                        key={s.key}
                        className={`rounded-md border px-2 py-1 text-[11px] font-medium ${style.cell}`}
                      >
                        {s.short}
                        {cell?.note ? ` · ${cell.note}` : ""}
                      </span>
                    );
                  })}
                </div>

                {(c.startedAt || c.completedAt) && (
                  <p className="mt-3 border-t border-white/[0.06] pt-2.5 font-mono text-[12px] text-slate-400">
                    {formatWorkTime(c.startedAt)} → {formatWorkTime(c.completedAt)}
                    {formatDuration(c.startedAt, c.completedAt) && (
                      <span className="ml-1.5 text-sky-300">
                        {formatDuration(c.startedAt, c.completedAt)}
                      </span>
                    )}
                  </p>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
