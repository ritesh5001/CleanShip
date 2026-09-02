import { VesselDiagramStatic } from "./vessel-diagram-static";
import { Card, JobStatusChip, ProgressBar, StatusChip } from "./ui";
import { formatDate, formatDateTime, relativeTime } from "@/lib/format";
import {
  compartmentNoun,
  progressOf,
  stagesFor,
  stateOf,
  type JobType,
} from "@/lib/holdwatch/stages";
import type { JobDetail } from "@/lib/holdwatch/jobs";
import { jobProgress } from "@/lib/holdwatch/jobs";
import { LiveRefresh } from "./live-refresh";

/**
 * The client's view of a job.
 *
 * Shared by the logged-in client dashboard and the public share link, so the
 * two can never drift into showing different things about the same job — the
 * failure mode being a client who checks both and finds them disagreeing.
 *
 * Read-only by construction: there is no toggle handler anywhere in this tree.
 */
export function ClientJobView({
  job,
  live = true,
}: {
  job: JobDetail;
  /** Off for a completed job — there is nothing left to poll for. */
  live?: boolean;
}) {
  const type = job.jobType as JobType;
  const stages = stagesFor(type);
  const progress = jobProgress(job, job.compartments);
  const noun = compartmentNoun(type, true);

  return (
    <div className="space-y-5">
      {live && job.status !== "complete" && <LiveRefresh />}

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[12px] text-slate-500">{job.reference}</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
              {job.vesselName}
            </h1>
            <p className="mt-1 text-[14px] text-slate-600">
              {job.port}
              {job.berth ? ` · ${job.berth}` : ""}
              {job.imo ? ` · IMO ${job.imo}` : ""}
            </p>
          </div>
          <JobStatusChip status={job.status} />
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
            ["Job type", type === "tank-cleaning" ? "Tank cleaning" : "Hold cleaning"],
            ["Scheduled", formatDate(job.scheduledFor)],
            ["Started", job.startedAt ? formatDateTime(job.startedAt) : "Not started"],
            ["Last update", relativeTime(job.updatedAt)],
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
        <VesselDiagramStatic
          className="mt-4"
          compartments={job.compartments.map((c) => ({
            id: c.id,
            label: c.label,
            position: c.position,
            completed: c.completed ?? [],
          }))}
          jobType={type}
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
                {compartmentNoun(type)}
              </th>
              {stages.map((s) => (
                <th key={s.key} className="px-2 py-3 text-center font-semibold text-slate-700">
                  {s.label}
                </th>
              ))}
              <th className="px-5 py-3 text-right font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {job.compartments.map((c) => {
              const completed = c.completed ?? [];
              const { done, total } = progressOf(completed, type);
              return (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <th scope="row" className="px-5 py-3 text-left font-semibold text-slate-900">
                    {c.label}
                    <span className="ml-2 font-mono text-[12px] font-normal text-slate-400">
                      {done}/{total}
                    </span>
                  </th>
                  {stages.map((s) => (
                    <td key={s.key} className="px-2 py-3 text-center">
                      <span
                        role="img"
                        aria-label={
                          completed.includes(s.key)
                            ? `${s.label} complete`
                            : `${s.label} not done`
                        }
                        className={`inline-block size-4 rounded-[3px] border ${
                          completed.includes(s.key)
                            ? "border-emerald-600 bg-emerald-500"
                            : "border-slate-300 bg-white"
                        }`}
                      />
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right">
                    <StatusChip state={stateOf(completed, type)} />
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
