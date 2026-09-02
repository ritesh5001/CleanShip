import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/cleantrack/app-shell";
import { StageBoard } from "@/components/cleantrack/stage-board";
import { Card, JobStatusChip } from "@/components/cleantrack/ui";
import { canUpdateJob, canViewJob, getJobDetail } from "@/lib/cleantrack/jobs";
import { formatDate } from "@/lib/format";
import type { JobType } from "@/lib/cleantrack/stages";

export const dynamic = "force-dynamic";

export default async function SupervisorJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession("supervisor", "admin");
  const { id } = await params;
  const job = await getJobDetail(Number(id));
  if (!job || !canViewJob(session, job)) notFound();

  const editable = canUpdateJob(session, job);

  return (
    <AppShell session={session}>
      <Link
        href="/cleantrack/app"
        className="text-[13px] font-medium text-blue-700 hover:underline"
      >
        ← All my jobs
      </Link>

      <Card className="mt-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[12px] text-slate-500">
              {job.reference}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
              {job.vesselName}
            </h1>
            <p className="mt-1 text-[14px] text-slate-600">
              {job.port}
              {job.berth ? ` · ${job.berth}` : ""} · {job.clientName}
            </p>
          </div>
          <JobStatusChip status={job.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-[13px] sm:grid-cols-4">
          {[
            { k: "Job type", v: job.jobType === "tank-cleaning" ? "Tank cleaning" : "Hold cleaning" },
            { k: "IMO", v: job.imo || "—" },
            { k: "Scheduled", v: formatDate(job.scheduledFor) },
            { k: "Compartments", v: String(job.compartmentCount) },
          ].map((row) => (
            <div key={row.k}>
              <dt className="text-slate-500">{row.k}</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">{row.v}</dd>
            </div>
          ))}
        </dl>

        {job.notes && (
          <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-700">
            {job.notes}
          </p>
        )}
      </Card>

      {!editable && (
        <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-600">
          You are not the assigned supervisor on this job, so it is read-only.
        </p>
      )}

      <div className="mt-5">
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
          readOnly={!editable}
        />
      </div>
    </AppShell>
  );
}
