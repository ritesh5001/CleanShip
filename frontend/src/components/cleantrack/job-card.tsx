import Link from "next/link";
import { JobStatusChip, ProgressBar } from "./ui";
import { compartmentNoun } from "@cleanship/backend/cleantrack/stages";
import { formatDate, relativeTime } from "@/lib/format";

export type JobCardData = {
  id: number;
  reference: string;
  vesselName: string;
  port: string;
  berth: string | null;
  jobType: string;
  status: string;
  clientName: string;
  supervisorName: string | null;
  compartmentCount: number;
  scheduledFor: Date | string | null;
  updatedAt: Date | string;
};

export function JobCard({
  job,
  href,
  progress,
  showClient = true,
}: {
  job: JobCardData;
  href: string;
  progress: { ratio: number; compartmentsComplete: number; compartmentsTotal: number };
  showClient?: boolean;
}) {
  const noun = compartmentNoun(
    job.jobType as "hold-cleaning" | "tank-cleaning",
    true,
  );

  return (
    <Link
      href={href}
      className="block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-blue-400"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[12px] text-slate-500">{job.reference}</p>
          <h2 className="mt-0.5 truncate text-lg font-bold text-slate-900">
            {job.vesselName}
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-600">
            {job.port}
            {job.berth ? ` · ${job.berth}` : ""}
            {showClient ? ` · ${job.clientName}` : ""}
          </p>
        </div>
        <JobStatusChip status={job.status} />
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="font-medium text-slate-700">
            {progress.compartmentsComplete} of {progress.compartmentsTotal}{" "}
            {noun.toLowerCase()} ready
          </span>
          <span className="font-mono text-slate-500">
            {Math.round(progress.ratio * 100)}%
          </span>
        </div>
        <ProgressBar ratio={progress.ratio} className="mt-2" />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
        <span>{job.scheduledFor ? formatDate(job.scheduledFor) : "Unscheduled"}</span>
        {job.supervisorName && <span>Supervisor: {job.supervisorName}</span>}
        <span>Updated {relativeTime(job.updatedAt)}</span>
      </div>
    </Link>
  );
}
