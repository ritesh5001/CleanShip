import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { StatusGrid } from "@/components/cleantrack/status-grid";
import { Card, PageTitle, VesselStatusChip } from "@/components/cleantrack/ui";
import { CopyField } from "@/components/cleantrack/copy-field";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { ApiError, getVessel, getVesselEvents, listSupervisors } from "@/lib/api";
import { CELL_STYLE, compartmentNoun } from "@/lib/cleantrack/types";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  assignSupervisorAction,
  rotateShareLinkAction,
  setVesselStatusAction,
  toggleShareAction,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminVesselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession("admin");
  const { id } = await params;

  let data, supervisors, events;
  try {
    [data, supervisors, events] = await Promise.all([
      getVessel(Number(id)),
      listSupervisors(),
      getVesselEvents(Number(id)),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <AppShell session={session} wide>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  const { vessel, shareUrl } = data;
  const { progress } = vessel;

  return (
    <AppShell session={session} wide>
      <Link
        href="/cleantrack/admin"
        className="text-[13px] font-medium text-blue-700 hover:underline"
      >
        ← All vessels
      </Link>

      <div className="mt-3">
        <PageTitle
          title={vessel.name}
          subtitle={
            <>
              <span className="font-mono">{vessel.reference}</span> · {vessel.port}
              {vessel.berth ? ` · ${vessel.berth}` : ""}
              {vessel.clientName ? ` · ${vessel.clientName}` : ""}
            </>
          }
          action={<VesselStatusChip status={vessel.status} />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
                  {
                    status: cell.status,
                    note: cell.note,
                    startedAt: cell.startedAt,
                    completedAt: cell.completedAt,
                  },
                ]),
              ),
            }))}
            initialVersion={vessel.version}
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
                {events.slice(0, 60).map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-wrap items-baseline gap-x-2 px-5 py-3 text-[13px]"
                  >
                    <span className="font-semibold text-slate-900">
                      {event.compartmentLabel}
                    </span>
                    <span className="text-slate-600">{event.stageLabel}</span>
                    <span className="font-semibold text-slate-800">
                      → {CELL_STYLE[event.toStatus].label}
                    </span>
                    {event.note && (
                      <span className="text-slate-500">“{event.note}”</span>
                    )}
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
              Vessel
            </h2>
            <dl className="mt-3 space-y-2.5 text-[13px]">
              {[
                ["Cleaning", compartmentNoun(vessel.type, true)],
                ["IMO", vessel.imo || "—"],
                ["Scheduled", formatDate(vessel.scheduledFor)],
                ["Started", formatDateTime(vessel.startedAt)],
                ["Completed", formatDateTime(vessel.completedAt)],
                [
                  "Progress",
                  `${progress.compartmentsComplete}/${progress.compartmentsTotal} ready`,
                ],
                ["Stages", String(vessel.stages.length)],
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
            <p className="mt-2 text-[13px] text-slate-600">
              The assigned supervisor is the only person who can update this
              vessel from their phone.
            </p>
            <form action={assignSupervisorAction} className="mt-3 space-y-3">
              <input type="hidden" name="vesselId" value={vessel.id} />
              <select
                name="supervisorId"
                defaultValue={vessel.supervisorId ?? ""}
                className="min-h-11 w-full rounded-md border border-slate-300 px-3 text-[15px]"
              >
                <option value="">Unassigned</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
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
              Customer link
            </h2>
            <p className="mt-2 text-[13px] text-slate-600">
              Read-only live view, no account needed.{" "}
              {vessel.imo
                ? "The customer enters the vessel's IMO number to open it."
                : "This vessel has no IMO on record, so the link opens directly — add one to gate it."}
            </p>
            {shareUrl ? (
              <CopyField value={shareUrl} className="mt-3" />
            ) : (
              <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
                Sharing is off. Existing links do not work.
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={toggleShareAction}>
                <input type="hidden" name="vesselId" value={vessel.id} />
                <input
                  type="hidden"
                  name="revoke"
                  value={shareUrl ? "1" : "0"}
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-md border border-slate-300 px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-50"
                >
                  {shareUrl ? "Turn sharing off" : "Turn sharing on"}
                </button>
              </form>
              <form action={rotateShareLinkAction}>
                <input type="hidden" name="vesselId" value={vessel.id} />
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
            <form action={setVesselStatusAction} className="mt-3 space-y-3">
              <input type="hidden" name="vesselId" value={vessel.id} />
              <select
                name="status"
                defaultValue={vessel.status}
                className="min-h-11 w-full rounded-md border border-slate-300 px-3 text-[15px]"
              >
                {["scheduled", "in-progress", "complete", "cancelled"].map((s) => (
                  <option key={s} value={s}>
                    {s.replace("-", " ")}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-11 w-full rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Override status
              </button>
              <p className="text-[12px] text-slate-500">
                Status follows the grid by itself. Override only to cancel a
                vessel or reopen a closed one.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
