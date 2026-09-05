import { VesselScene } from "./vessel-scene";
import { Card, ProgressBar, StatusChip, VesselStatusChip } from "./ui";
import { LiveRefresh } from "./live-refresh";
import { formatDate, formatDateTime, relativeTime } from "@/lib/format";
import {
  CELL_STYLE,
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
 * It shows the same grid the crew works from, in the same colours. A customer
 * comparing this against a photo of the supervisor's phone should see the same
 * picture — that agreement is the entire product.
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
  const noun = compartmentNoun(vessel.type, true);

  return (
    <div className="space-y-5">
      {live && vessel.status !== "complete" && <LiveRefresh />}

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[12px] text-slate-500">
              {vessel.reference}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
              {vessel.name}
            </h1>
            <p className="mt-1 text-[14px] text-slate-600">
              {vessel.port}
              {vessel.berth ? ` · ${vessel.berth}` : ""}
              {vessel.imo ? ` · IMO ${vessel.imo}` : ""}
            </p>
          </div>
          <VesselStatusChip status={vessel.status} />
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-[14px]">
            <span className="font-semibold text-slate-800">
              {progress.compartmentsComplete} of {progress.compartmentsTotal}{" "}
              {noun.toLowerCase()} ready
            </span>
            <span className="font-mono text-slate-500">
              {Math.round(progress.ratio * 100)}%
            </span>
          </div>
          <ProgressBar ratio={progress.ratio} className="mt-2" />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-[13px] sm:grid-cols-4">
          {[
            ["Cleaning", noun],
            ["Scheduled", formatDate(vessel.scheduledFor)],
            [
              "Started",
              vessel.startedAt ? formatDateTime(vessel.startedAt) : "Not started",
            ],
            ["Last update", relativeTime(vessel.updatedAt)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-slate-500">{k}</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">Vessel</h2>
        <VesselScene
          className="mt-4"
          compartments={vessel.compartments.map((c) => ({
            id: c.id,
            label: c.label,
            position: c.position,
            state: c.state,
            cells: Object.fromEntries(
              Object.entries(c.cells).map(([k, cell]) => [
                k,
                { status: cell.status, note: cell.note },
              ]),
            ),
          }))}
          stages={stages}
          vesselType={vessel.type}
        />
      </Card>

      <Card className="overflow-x-auto">
        <h2 className="px-5 pt-5 text-base font-bold text-slate-900">
          Stage by stage
        </h2>
        <table className="mt-4 w-full min-w-[620px] border-collapse text-[13px]">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left">
              <th className="px-5 py-3 font-semibold text-slate-700">
                {compartmentNoun(vessel.type)}
              </th>
              {stages.map((s) => (
                <th
                  key={s.key}
                  className="px-2 py-3 text-center font-semibold text-slate-700"
                >
                  {s.label}
                </th>
              ))}
              <th className="px-3 py-3 text-left font-semibold text-slate-700">
                Started
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-700">
                Finished
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {vessel.compartments.map((c) => {
              const statuses = statusesOf(c, stages);
              const { done, total } = progressOf(statuses);
              return (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <th
                    scope="row"
                    className="px-5 py-3 text-left font-semibold text-slate-900"
                  >
                    {c.label}
                    <span className="ml-2 font-mono text-[12px] font-normal text-slate-400">
                      {total === 0 ? "N/A" : `${done}/${total}`}
                    </span>
                  </th>
                  {stages.map((s) => {
                    const cell = c.cells[s.key];
                    const status = cell?.status ?? "pending";
                    const style = CELL_STYLE[status];
                    return (
                      <td key={s.key} className="px-1.5 py-2 text-center">
                        <span
                          title={cell?.note ?? style.label}
                          aria-label={`${s.label}: ${style.label}${
                            cell?.note ? ` — ${cell.note}` : ""
                          }`}
                          className={`inline-flex min-h-8 w-full items-center justify-center rounded border px-1 text-[11px] font-semibold ${style.cell}`}
                        >
                          {cell?.note ?? (status === "pending" ? "" : style.short)}
                        </span>
                      </td>
                    );
                  })}
                  {/* When the work happened, per hold. This is the question
                      a customer is actually asking when they open the link —
                      "is it done, and when" — and the paper sheet answered it
                      with two handwritten columns. */}
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                    {formatWorkTime(c.startedAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                    {formatWorkTime(c.completedAt)}
                    {formatDuration(c.startedAt, c.completedAt) && (
                      <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-800">
                        {formatDuration(c.startedAt, c.completedAt)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusChip state={c.state} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
