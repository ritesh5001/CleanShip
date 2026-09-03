import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { StatusGrid } from "@/components/cleantrack/status-grid";
import { Card, VesselStatusChip } from "@/components/cleantrack/ui";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { ApiError, getVessel } from "@/lib/api";
import { compartmentNoun } from "@/lib/cleantrack/types";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SupervisorVesselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession("supervisor", "admin");
  const { id } = await params;

  let data;
  try {
    data = await getVessel(Number(id));
  } catch (err) {
    /* 403 means it is someone else's vessel. Not-found rather than a lecture:
       the supervisor has no way to act on "you are not assigned to this". */
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
      notFound();
    }
    return (
      <AppShell session={session}>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  const { vessel } = data;
  const editable =
    session.role === "admin" || vessel.supervisorId === session.sub;

  return (
    <AppShell session={session}>
      <Link
        href="/cleantrack/app"
        className="text-[13px] font-medium text-blue-700 hover:underline"
      >
        ← All my vessels
      </Link>

      <Card className="mt-3 p-5">
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
              {vessel.clientName ? ` · ${vessel.clientName}` : ""}
            </p>
          </div>
          <VesselStatusChip status={vessel.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-[13px] sm:grid-cols-4">
          {[
            { k: "Cleaning", v: compartmentNoun(vessel.type, true) },
            { k: "IMO", v: vessel.imo || "—" },
            { k: "Scheduled", v: formatDate(vessel.scheduledFor) },
            {
              k: compartmentNoun(vessel.type, true),
              v: String(vessel.compartmentCount),
            },
          ].map((row) => (
            <div key={row.k}>
              <dt className="text-slate-500">{row.k}</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">{row.v}</dd>
            </div>
          ))}
        </dl>

        {vessel.notes && (
          <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-700">
            {vessel.notes}
          </p>
        )}
      </Card>

      {!editable && (
        <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-600">
          You are not the assigned supervisor, so this is read-only.
        </p>
      )}

      <div className="mt-5">
        <StatusGrid
          vesselId={vessel.id}
          vesselType={vessel.type}
          stages={vessel.stages}
          initialCompartments={vessel.compartments.map((c) => ({
            id: c.id,
            label: c.label,
            position: c.position,
            notes: c.notes,
            cells: Object.fromEntries(
              Object.entries(c.cells).map(([k, cell]) => [
                k,
                { status: cell.status, note: cell.note },
              ]),
            ),
          }))}
          initialVersion={vessel.version}
          readOnly={!editable}
        />
      </div>
    </AppShell>
  );
}
