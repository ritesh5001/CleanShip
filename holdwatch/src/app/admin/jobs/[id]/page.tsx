import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { StageBoard } from "@/components/stage-board";
import { Card, JobStatusChip, PageTitle } from "@/components/ui";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getJobDetail, getJobEvents, jobProgress } from "@/lib/jobs";
import { env } from "@/lib/env";
import { formatDate, formatDateTime } from "@/lib/format";
import type { JobType } from "@/lib/stages";
import {
  assignSupervisorAction,
  rotateShareLinkAction,
  setJobStatusAction,
  toggleShareAction,
} from "../../actions";
import { CopyField } from "@/components/copy-field";

export const dynamic = "force-dynamic";

export default async function AdminJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession("admin");
  const { id } = await params;
  const job = await getJobDetail(Number(id));
  if (!job) notFound();

  const [supervisors, events] = await Promise.all([
    db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.role, "supervisor"))
      .orderBy(asc(users.name)),
    getJobEvents(job.id, 60),
  ]);

  const progress = jobProgress(job, job.compartments);
  const shareUrl = `${env.APP_URL}/j/${job.shareToken}`;

  return (
    <AppShell session={session} wide>
      <Link href="/admin" className="text-[13px] font-medium text-blue-700 hover:underline">
        ← All jobs
      </Link>

      <div className="mt-3">
        <PageTitle
          title={job.vesselName}
          subtitle={
            <>
              <span className="font-mono">{job.reference}</span> · {job.port}
              {job.berth ? ` · ${job.berth}` : ""} · {job.clientName}
            </>
          }
          action={<JobStatusChip status={job.status} />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StageBoard
            jobId={job.id}
            jobType={job.jobType as JobType}
            initialCompartments={job.compartments.map((c) => ({
              id: c.id,
              label: c.label,
              position: c.position,
              completed: c.completed ?? [],
            }))}
            initialVersion={job.version}
          />

          <Card className="mt-6">
            <h2 className="border-b border-slate-200 px-5 py-4 text-base font-bold text-slate-900">
              Activity
            </h2>
            {events.length === 0 ? (
              <p className="px-5 py-6 text-[14px] text-slate-500">
                Nothing recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {events.map(({ event, compartmentLabel }) => (
                  <li key={event.id} className="flex flex-wrap items-baseline gap-x-2 px-5 py-3 text-[13px]">
                    <span className="font-semibold text-slate-900">
                      {compartmentLabel}
                    </span>
                    <span className="text-slate-600">
                      {event.stageKey.replace(/_/g, " ")}
                    </span>
                    <span
                      className={
                        event.action === "completed"
                          ? "font-semibold text-emerald-700"
                          : "font-semibold text-amber-700"
                      }
                    >
                      {event.action}
                    </span>
                    <span className="text-slate-500">by {event.userName}</span>
                    <span className="ml-auto font-mono text-[12px] text-slate-400">
                      {formatDateTime(event.occurredAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Job
            </h2>
            <dl className="mt-3 space-y-2.5 text-[13px]">
              {[
                ["Type", job.jobType === "tank-cleaning" ? "Tank cleaning" : "Hold cleaning"],
                ["IMO", job.imo || "—"],
                ["Scheduled", formatDate(job.scheduledFor)],
                ["Started", formatDateTime(job.startedAt)],
                ["Completed", formatDateTime(job.completedAt)],
                ["Progress", `${progress.compartmentsComplete}/${progress.compartmentsTotal} ready`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Supervisor
            </h2>
            <form action={assignSupervisorAction} className="mt-3 space-y-3">
              <input type="hidden" name="jobId" value={job.id} />
              <select
                name="supervisorId"
                defaultValue={job.supervisorId ?? ""}
                className="w-full min-h-11 rounded-md border border-slate-300 px-3 text-[15px]"
              >
                <option value="">Unassigned</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-11 w-full rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Save
              </button>
            </form>
          </Card>

          <Card className="p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Client link
            </h2>
            <p className="mt-2 text-[13px] text-slate-600">
              Read-only live view. Anyone with this link can see the job — send
              it, do not publish it.
            </p>
            {job.shareRevoked ? (
              <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
                Sharing is off. Existing links do not work.
              </p>
            ) : (
              <CopyField value={shareUrl} className="mt-3" />
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={toggleShareAction}>
                <input type="hidden" name="jobId" value={job.id} />
                <input type="hidden" name="revoke" value={job.shareRevoked ? "0" : "1"} />
                <button
                  type="submit"
                  className="min-h-11 rounded-md border border-slate-300 px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-50"
                >
                  {job.shareRevoked ? "Turn sharing on" : "Turn sharing off"}
                </button>
              </form>
              <form action={rotateShareLinkAction}>
                <input type="hidden" name="jobId" value={job.id} />
                <button
                  type="submit"
                  className="min-h-11 rounded-md border border-slate-300 px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-50"
                >
                  New link
                </button>
              </form>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Status
            </h2>
            <form action={setJobStatusAction} className="mt-3 space-y-3">
              <input type="hidden" name="jobId" value={job.id} />
              <select
                name="status"
                defaultValue={job.status}
                className="w-full min-h-11 rounded-md border border-slate-300 px-3 text-[15px]"
              >
                {["scheduled", "in-progress", "complete", "cancelled"].map((s) => (
                  <option key={s} value={s}>{s.replace("-", " ")}</option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-11 w-full rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Override status
              </button>
              <p className="text-[12px] text-slate-500">
                Status normally follows the checklist by itself. Override only
                to cancel a job or reopen a closed one.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
