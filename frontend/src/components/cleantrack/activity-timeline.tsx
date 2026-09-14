import type { PublicEvent } from "@/lib/api";
import { stampOf, type CellStatus, type Stage } from "@/lib/cleantrack/types";
import { NA_GREY, stageShade } from "@/lib/cleantrack/stage-colors";

/**
 * The latest recorded activity on each hold or tank, newest first.
 *
 * One line per compartment: the API sends only the most recent change for
 * each, so work on Hold 1 today replaces the entry for Hold 1 from last week.
 * Sorted by time alone, with the date on every row since the entries can be
 * days apart.
 *
 * Times are the times the work happened, not when a phone got signal to
 * report it — the API sends only `occurredAt` for exactly that reason.
 */

type Props = {
  events: PublicEvent[];
  stages: Stage[];
};

const VERB: Record<CellStatus, string> = {
  pending: "reset to not started",
  in_progress: "commenced",
  done: "completed",
  na: "marked not applicable",
};

export function ActivityTimeline({ events, stages }: Props) {
  if (events.length === 0) {
    return (
      <p className="m-0 text-[15px] text-white/60">
        Nothing has been recorded on this vessel yet.
      </p>
    );
  }

  const stageIndex = new Map(stages.map((s, i) => [s.key, i]));
  const sorted = [...events].sort((a, b) =>
    a.occurredAt < b.occurredAt ? 1 : -1,
  );

  return (
    <ol className="m-0 list-none p-0">
      {sorted.map((e) => {
        const idx = stageIndex.get(e.stageKey) ?? 0;
        const shade = e.toStatus === "na" ? NA_GREY : stageShade(idx);
        return (
          <li key={e.id} className="flex gap-4 border-t border-white/[0.12] py-3">
            <span className="w-[112px] shrink-0 pt-[3px] font-[family-name:var(--font-mono)] text-[13px] tabular-nums text-white/70">
              {stampOf(e.occurredAt)}
            </span>

            {/* The stage's own colour, matching the table above. */}
            <span
              aria-hidden="true"
              className="mt-[6px] h-[14px] w-[4px] shrink-0"
              style={{ background: e.toStatus === "done" ? shade.dark : shade.light }}
            />

            <span className="min-w-0 flex-1">
              <span className="block text-[16px] leading-snug text-white/90">
                <strong className="font-semibold text-white">{e.compartmentLabel}</strong>{" "}
                &middot; {e.stageLabel}{" "}
                <span className="text-white/65">{VERB[e.toStatus]}</span>
              </span>
              {e.note && (
                <span className="mt-1 block text-[14px] italic text-white/60">
                  &ldquo;{e.note}&rdquo;
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

