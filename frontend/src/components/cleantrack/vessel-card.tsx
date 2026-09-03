import Link from "next/link";
import { VesselStatusChip, ProgressBar } from "./ui";
import { compartmentNoun, type VesselSummary } from "@/lib/cleantrack/types";
import { formatDate, relativeTime } from "@/lib/format";

export function VesselCard({
  vessel,
  href,
  showClient = true,
}: {
  vessel: VesselSummary;
  href: string;
  showClient?: boolean;
}) {
  const noun = compartmentNoun(vessel.type, true).toLowerCase();
  const { progress } = vessel;

  return (
    <Link
      href={href}
      className="block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-blue-400"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[12px] text-slate-500">{vessel.reference}</p>
          <h2 className="mt-0.5 truncate text-lg font-bold text-slate-900">
            {vessel.name}
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-600">
            {vessel.port}
            {vessel.berth ? ` · ${vessel.berth}` : ""}
            {showClient && vessel.clientName ? ` · ${vessel.clientName}` : ""}
          </p>
        </div>
        <VesselStatusChip status={vessel.status} />
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="font-medium text-slate-700">
            {progress.compartmentsComplete} of {progress.compartmentsTotal} {noun} ready
          </span>
          <span className="font-mono text-slate-500">
            {Math.round(progress.ratio * 100)}%
          </span>
        </div>
        <ProgressBar ratio={progress.ratio} className="mt-2" />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
        <span>
          {vessel.scheduledFor ? formatDate(vessel.scheduledFor) : "Unscheduled"}
        </span>
        {vessel.supervisorName ? (
          <span>Supervisor: {vessel.supervisorName}</span>
        ) : (
          <span className="font-medium text-amber-700">No supervisor assigned</span>
        )}
        <span>Updated {relativeTime(vessel.updatedAt)}</span>
      </div>
    </Link>
  );
}
