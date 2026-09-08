import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { StatusGrid } from "@/components/cleantrack/status-grid";
import { Card, VesselStatusChip } from "@/components/cleantrack/ui";
import { CopyField } from "@/components/cleantrack/copy-field";
import { StageEditor } from "@/components/cleantrack/stage-editor";
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
      {/* Breadcrumb, then the vessel's identity on one line and the three
          things an admin does to it on the other. */}
      <nav className="font-mono text-[11px] uppercase tracking-[0.12em]">
        <Link href="/cleantrack/admin" className="text-[#8a9aa8] hover:text-[#1461a0]">
          Vessels
        </Link>
        <span className="px-2 text-[#b9c5cf]">/</span>
        <span className="text-[#1461a0]">{vessel.reference}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(28px,4vw,38px)] font-bold uppercase leading-none tracking-[0.01em] text-[#0f1c27]">
              {vessel.name}
            </h1>
            {vessel.imo && (
              <span className="border border-[#dce4eb] bg-white px-2 py-1 font-mono text-[12px] tracking-[0.06em] text-[#4c5c6b]">
                IMO {vessel.imo}
              </span>
            )}
            <VesselStatusChip status={vessel.status} />
          </div>

          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-[14px] text-[#4c5c6b]">
            <span>
              {vessel.port}
              {vessel.berth ? ` · ${vessel.berth}` : ""}
            </span>
            <span>
              {vessel.type === "tank" ? "Tanker · tank cleaning" : "Bulk carrier · hold cleaning"}
            </span>
            {vessel.clientName && (
              <span>
                Client — <strong className="font-semibold text-[#0f1c27]">{vessel.clientName}</strong>
              </span>
            )}
            <span>
              Supervisor —{" "}
              <strong className="font-semibold text-[#0f1c27]">
                {vessel.supervisorName ?? "Unassigned"}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <a
            href="#supervisor"
            className="flex h-11 items-center border border-[#b9c5cf] bg-white px-4 text-[14px] font-semibold text-[#0f1c27] hover:bg-[#f1f7fc]"
          >
            Reassign
          </a>
          <form action={toggleShareAction}>
            <input type="hidden" name="vesselId" value={vessel.id} />
            <input type="hidden" name="revoke" value={shareUrl ? "1" : "0"} />
            <button
              type="submit"
              className="flex h-11 items-center border border-[#b9c5cf] bg-white px-4 text-[14px] font-semibold text-[#0f1c27] hover:bg-[#f1f7fc]"
            >
              {shareUrl ? "Revoke link" : "Enable link"}
            </button>
          </form>
          <a
            href="#customer-link"
            className="flex h-11 items-center border border-[#0e3d6b] bg-[#1461a0] px-4 text-[14px] font-semibold text-white hover:bg-[#0e3d6b]"
          >
            Share with client
          </a>
        </div>
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
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* The stage list, editable beside the grid it governs rather than
              behind a modal that hides it. */}
          <Card className="p-5">
            <StageEditor vesselId={vessel.id} stages={vessel.stages} />
          </Card>

          <div id="supervisor" className="scroll-mt-20">
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
                className="min-h-11 w-full rounded-none border border-slate-300 px-3 text-[15px]"
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
                className="min-h-11 w-full rounded-none bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Save
              </button>
            </form>
          </Card>
          </div>

          {/* Navy, because the link is the one thing on this page that is
              live to someone outside the company — and since the IMO gate was
              removed it is the ONLY thing controlling that access. */}
          <div id="customer-link" className="bg-[#0a2e52] p-5">
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9de3e7]">
              Customer link · {shareUrl ? "Active" : "Revoked"}
            </p>
            {shareUrl ? (
              <>
                <CopyField value={shareUrl} className="mt-3" />
                <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                  Opens straight onto the vessel — no account, no password.
                  Reissue or revoke any time.
                </p>
              </>
            ) : (
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                Sharing is off. Any link already sent now answers with nothing.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={toggleShareAction}>
                <input type="hidden" name="vesselId" value={vessel.id} />
                <input type="hidden" name="revoke" value={shareUrl ? "1" : "0"} />
                <button
                  type="submit"
                  className="h-10 border border-white/25 px-3 text-[13px] font-semibold text-white hover:bg-white/10"
                >
                  {shareUrl ? "Revoke" : "Turn on"}
                </button>
              </form>
              <form action={rotateShareLinkAction}>
                <input type="hidden" name="vesselId" value={vessel.id} />
                <button
                  type="submit"
                  className="h-10 border border-white/25 px-3 text-[13px] font-semibold text-white hover:bg-white/10"
                >
                  Reissue
                </button>
              </form>
            </div>
          </div>

          <Card className="p-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Status
            </h2>
            <form action={setVesselStatusAction} className="mt-3 space-y-3">
              <input type="hidden" name="vesselId" value={vessel.id} />
              <select
                name="status"
                defaultValue={vessel.status}
                className="min-h-11 w-full rounded-none border border-slate-300 px-3 text-[15px]"
              >
                {["scheduled", "in-progress", "complete", "cancelled"].map((s) => (
                  <option key={s} value={s}>
                    {s.replace("-", " ")}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-11 w-full rounded-none border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
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
