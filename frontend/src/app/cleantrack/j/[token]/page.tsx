import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError, getSharedVessel } from "@/lib/api";
import { LiveRefresh } from "@/components/cleantrack/live-refresh";
import { VesselPlanView } from "@/components/cleantrack/vessel-plan-view";
import {
  compartmentState,
  progressOf,
  statusesOf,
} from "@/lib/cleantrack/types";

export const dynamic = "force-dynamic";

/**
 * The customer's view. No account, and now no challenge either.
 *
 * The link used to open onto an IMO prompt. That gate is gone by client
 * direction: the link opens straight onto the vessel. Which makes the link
 * itself the credential — the office issues it, sees how often it is opened,
 * and revokes it when the job closes.
 *
 * The page shows this vessel and nothing else: no client list, no other
 * vessels, no navigation to walk anywhere from here.
 */
export const metadata: Metadata = {
  title: "Cleaning progress",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SharedVesselPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let vessel;
  try {
    vessel = (await getSharedVessel(token)).vessel;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  if (!vessel) notFound();

  const pct = Math.round(vessel.progress.ratio * 100);
  const total = vessel.compartments.length;
  const complete = vessel.compartments.filter(
    (c) => compartmentState(statusesOf(c, vessel.stages)) === "complete",
  ).length;
  const remaining = total - complete;

  /* Latest movements, newest first. The customer gets what changed and when —
     never who, because the crew's names were not part of what was sold. */
  const movements = vessel.compartments
    .flatMap((c) =>
      vessel.stages
        .map((s) => ({ compartment: c.label, stage: s, cell: c.cells[s.key] }))
        .filter((m) => m.cell && m.cell.status !== "pending"),
    )
    .sort((a, b) => (a.cell!.updatedAt < b.cell!.updatedAt ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="min-h-dvh bg-[#06203a] text-[#dce4eb]">
      <header className="border-b border-white/[0.12]">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <span className="font-[family-name:var(--font-display)] text-[15px] font-bold uppercase tracking-[0.08em] text-white">
            CleanShip
          </span>
          <LiveRefresh dark />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <p className="m-0 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-white/50">
          {[vessel.imo ? `IMO ${vessel.imo}` : null, vessel.port, vessel.berth]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <h1 className="mt-3 mb-4 font-[family-name:var(--font-display)] text-[clamp(34px,7vw,56px)] font-bold uppercase leading-[1.04] tracking-[0.01em] text-white text-balance">
          {vessel.name}
        </h1>

        <p className="m-0 text-[12px] uppercase tracking-[0.14em] text-[#00b0b9]">
          {vessel.status === "complete"
            ? "Cleaning complete"
            : "Cleaning in progress"}{" "}
          &middot; Updated live
        </p>

        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.55] text-white/75">
          {remaining > 0
            ? `${remaining} of ${total} compartments still in cleaning.`
            : `All ${total} compartments have passed inspection.`}
        </p>

        {/* Progress. One number, stated plainly — and no projected ready date,
            because nothing here should be a promise the crew has not made. */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <span className="font-[family-name:var(--font-display)] text-[44px] font-bold leading-none tabular-nums text-[#00b0b9]">
              {pct}%
            </span>
            <span className="pb-1 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.1em] text-white/45">
              {complete} of {total} holds passed inspection
            </span>
          </div>
          <div
            className="mt-3 h-[6px] w-full overflow-hidden rounded-[3px] bg-white/[0.10]"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full bg-[#00b0b9]" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* The plan view: a schematic hull, not a rendered one. */}
        <section className="mt-12">
          <h2 className="m-0 mb-5 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Hold by hold &middot; plan view
          </h2>
          <VesselPlanView compartments={vessel.compartments} stages={vessel.stages} />
        </section>

        {movements.length > 0 && (
          <section className="mt-12">
            <h2 className="m-0 mb-4 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Last movements
            </h2>
            <ul className="m-0 list-none space-y-0 p-0">
              {movements.map((m, i) => (
                <li
                  key={`${m.compartment}-${m.stage.key}-${i}`}
                  className="flex gap-4 border-t border-white/[0.09] py-3 text-[15px]"
                >
                  <span className="shrink-0 pt-[2px] font-[family-name:var(--font-mono)] text-[12px] tabular-nums text-white/45">
                    {new Date(m.cell!.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-white/80">
                    {m.compartment} &middot; {m.stage.label}{" "}
                    <span className="text-white/50">
                      {m.cell!.status === "done"
                        ? "finished"
                        : m.cell!.status === "na"
                          ? "not applicable"
                          : "started"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-14 border-t border-white/[0.12] pt-6">
          {vessel.clientName && (
            <p className="m-0 text-[14px] text-white/60">
              Questions on this vessel &mdash; {vessel.clientName} desk.
            </p>
          )}
          <p className="mt-3 m-0 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-white/35">
            Read-only &middot; private link &middot; no account issued
          </p>
        </footer>
      </main>
    </div>
  );
}
