import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError, getSharedEvents, getSharedVessel } from "@/lib/api";
import { LiveRefresh } from "@/components/cleantrack/live-refresh";
import { VesselPlanView } from "@/components/cleantrack/vessel-plan-view";
import { ClientProgressTable } from "@/components/cleantrack/client-progress-table";
import { ActivityTimeline } from "@/components/cleantrack/activity-timeline";
import { stageShade } from "@/lib/cleantrack/stage-colors";
import {
  compartmentNoun,
  compartmentState,
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

  /* The history is additive: if it fails, the page still answers "where is my
     ship", which is what the link is for. */
  let events: Awaited<ReturnType<typeof getSharedEvents>> = [];
  try {
    events = await getSharedEvents(token);
  } catch {
    events = [];
  }

  const pct = Math.round(vessel.progress.ratio * 100);
  const total = vessel.compartments.length;
  const complete = vessel.compartments.filter(
    (c) => compartmentState(statusesOf(c, vessel.stages)) === "complete",
  ).length;
  const remaining = total - complete;


  return (
    <div className="min-h-dvh bg-[#06203a] text-[#dce4eb]">
      <header className="border-b border-white/[0.12]">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <span className="flex items-center gap-2.5">
            {/* White version: the brand blue is far too dark to read on navy. */}
            <Image
              src="/brand/cleanship-mark-white.png"
              alt=""
              width={26}
              height={26}
              className="block"
              priority
            />
            <span className="font-[family-name:var(--font-display)] text-[15px] font-bold uppercase tracking-[0.08em] text-white">
              CleanShip
            </span>
          </span>
          <LiveRefresh dark />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        {vessel.clientName && (
          <p className="m-0 mb-4 font-[family-name:var(--font-display)] text-[clamp(22px,3.4vw,30px)] font-bold uppercase leading-none tracking-[0.03em] text-[#00b0b9]">
            {vessel.clientName}
          </p>
        )}

        <p className="m-0 font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-[0.14em] text-white/70">
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

        <p className="mt-4 max-w-[60ch] text-[18px] leading-[1.55] text-white/90">
          {remaining > 0
            ? `${remaining} of ${total} ${compartmentNoun(vessel.type, true).toLowerCase()} still in cleaning.`
            : `All ${total} ${compartmentNoun(vessel.type, true).toLowerCase()} are done.`}
        </p>

        {/* Progress. One number, stated plainly — and no projected ready date,
            because nothing here should be a promise the crew has not made. */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <span className="font-[family-name:var(--font-display)] text-[44px] font-bold leading-none tabular-nums text-[#00b0b9]">
              {pct}%
            </span>
            <span className="pb-1 font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-[0.1em] text-white/70">
              {complete} of {total}{" "}
              {compartmentNoun(vessel.type, true).toLowerCase()} are done
            </span>
          </div>
          <div
            className="mt-3 h-[6px] w-full overflow-hidden rounded-none bg-white/[0.10]"
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
          <h2 className="m-0 mb-5 font-[family-name:var(--font-body)] text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">
            {compartmentNoun(vessel.type)} by {compartmentNoun(vessel.type).toLowerCase()}{" "}
            &middot; plan view
          </h2>
          <VesselPlanView
            compartments={vessel.compartments}
            stages={vessel.stages}
            vesselType={vessel.type}
          />

          {/* What each colour means. Without this the blocks are decoration. */}
          <ul className="mt-5 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
            {vessel.stages.map((s, i) => (
              <li key={s.key} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0"
                  style={{ background: stageShade(i).dark }}
                />
                <span className="text-[14px] text-white/85">{s.label}</span>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: "#d6a90a" }}
              />
              <span className="text-[14px] text-white/85">In progress</span>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="m-0 mb-4 font-[family-name:var(--font-body)] text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">
            Stage by stage
          </h2>
          <ClientProgressTable
            compartments={vessel.compartments}
            stages={vessel.stages}
            vesselType={vessel.type}
          />
          <p className="mt-3 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.1em] text-white/60">
            Light = under way &middot; solid = finished &middot; times are local, 24-hour
          </p>
        </section>

        {/* The full history, not a sample of it. This is the section a
            charterer opens when the job is over and the laytime is being
            argued: every stage, every hold, in the order it happened. */}
        <section className="mt-12">
          <h2 className="m-0 mb-5 font-[family-name:var(--font-body)] text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">
            Full activity
          </h2>
          <ActivityTimeline events={events} stages={vessel.stages} />
        </section>

        <footer className="mt-14 border-t border-white/[0.12] pt-6">
          {vessel.clientName && (
            <p className="m-0 text-[15px] text-white/80">
              Questions on this vessel &mdash; {vessel.clientName} desk.
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}
