import { VesselDiagramStatic } from "./vessel-diagram-static";
import { LiveRefresh } from "./live-refresh";
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

  return (
    <div className="space-y-10">
      {/* ---------------------------------------------------------------- */}
      {/* Hero: the vessel, and the one number that answers the question.   */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]">
        {/* Ambient light. Two soft pools rather than a flat panel — it is
            what stops a dark surface reading as an unstyled black box, and
            it sits under the canvas so it never fights the model. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 22% 12%, rgba(56,189,248,0.16), transparent 70%), radial-gradient(50% 50% at 85% 85%, rgba(34,197,94,0.12), transparent 70%)",
          }}
        />

        <div className="relative px-5 pt-6 sm:px-8 sm:pt-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[12px] tracking-widest text-sky-300/70">
                {vessel.reference}
              </p>
              <h1 className="mt-1 truncate font-[family-name:var(--font-display)] text-[30px] font-bold leading-tight tracking-tight text-white sm:text-[38px]">
                {vessel.name}
              </h1>
              <p className="mt-1 text-[13px] text-slate-400">
                {vessel.port}
                {vessel.berth ? ` · ${vessel.berth}` : ""}
                {vessel.imo ? ` · IMO ${vessel.imo}` : ""}
              </p>
            </div>
            {live && vessel.status !== "complete" && <LiveRefresh dark />}
          </div>
        </div>

        {/* The model. Full bleed inside the hero and deliberately not boxed —
            a card around it would put a line between the ship and its data,
            which is the exact seam this page is trying not to have. */}
        <div className="relative -mt-2">
          <VesselDiagramStatic
            compartments={vessel.compartments.map((c) => ({
              id: c.id,
              label: c.label,
              position: c.position,
              cells: c.cells,
            }))}
            stages={stages}
            vesselType={vessel.type}
            palette={STATE_STYLE_DARK}
          />
          {/* Scrim: the readings below rise out of the scene rather than
              starting after it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0b1220]"
          />
        </div>

        {/* The headline number, sitting on the scrim. */}
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[13px] uppercase tracking-[0.16em] text-slate-400">
                {noun} ready
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-[40px] font-bold leading-none text-white tabular-nums sm:text-[52px]">
                {progress.compartmentsComplete}
                <span className="text-slate-500">
                  /{progress.compartmentsTotal}
                </span>
              </p>
            </div>
            <p className="font-mono text-[28px] font-semibold text-emerald-300 tabular-nums sm:text-[34px]">
              {pct}%
            </p>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background:
                  pct === 100
                    ? "linear-gradient(90deg,#34d399,#4ade80)"
                    : "linear-gradient(90deg,#f59e0b,#fbbf24)",
              }}
            />
          </div>
        </div>
      </section>

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
        ].map((row) => (
          <div
            key={row.k}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              {row.k}
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-slate-100">
              {row.v}
            </p>
          </div>
        ))}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Hold by hold. A table on desktop, cards on a phone.               */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-white">
          Stage by stage
        </h2>
        <p className="mt-1 text-[13px] text-slate-400">
          Every {compartmentNoun(vessel.type).toLowerCase()}, and when the crew
          worked it.
        </p>

        {/* Desktop: the full matrix. */}
        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] lg:block">
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
        </div>

        {/* Phone: one card per compartment. A ten-column matrix on a 375px
            screen is a horizontal scroll nobody performs. */}
        <div className="mt-4 space-y-3 lg:hidden">
          {vessel.compartments.map((c) => {
            const statuses = statusesOf(c, stages);
            const { done, total } = progressOf(statuses);
            const state = STATE_STYLE_DARK[c.state];
            return (
              <div
                key={c.id}
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
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
