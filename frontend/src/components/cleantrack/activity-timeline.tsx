import type { PublicEvent } from "@/lib/api";
import type { CellStatus, Stage } from "@/lib/cleantrack/types";
import { NA_GREY, stageShade } from "@/lib/cleantrack/stage-colors";

/**
 * Everything that has happened on this vessel, in order.
 *
 * The page above answers "where is it now"; this answers "how did it get
 * here", which is the question asked once the job is over and an invoice is
 * being argued about. Grouped by day because a cleaning job runs across
 * several, and a flat list of eighty times with no days in it is unreadable.
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
  in_progress: "started",
  done: "finished",
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
  const days = groupByDay(events);

  return (
    <ol className="m-0 list-none p-0">
      {days.map(([day, entries]) => (
        <li key={day} className="mb-8 last:mb-0">
          <h3 className="m-0 mb-3 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.14em] text-[#00b0b9]">
            {day}
          </h3>

          <ol className="m-0 list-none p-0">
            {entries.map((e) => {
              const idx = stageIndex.get(e.stageKey) ?? 0;
              const shade = e.toStatus === "na" ? NA_GREY : stageShade(idx);
              return (
                <li key={e.id} className="flex gap-4 border-t border-white/[0.12] py-3">
                  <span className="w-[46px] shrink-0 pt-[3px] font-[family-name:var(--font-mono)] text-[14px] tabular-nums text-white/70">
                    {clock(e.occurredAt)}
                  </span>

                  {/* The stage's own colour, so a reader can follow one stage
                      down the list without reading every line. */}
                  <span
                    aria-hidden="true"
                    className="mt-[6px] h-[14px] w-[4px] shrink-0"
                    style={{
                      background:
                        e.toStatus === "done" ? shade.dark : shade.light,
                    }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] leading-snug text-white/90">
                      <strong className="font-semibold text-white">
                        {e.compartmentLabel}
                      </strong>{" "}
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
        </li>
      ))}
    </ol>
  );
}

/** Newest day first, and newest first within each day. */
function groupByDay(events: PublicEvent[]) {
  const sorted = [...events].sort((a, b) =>
    a.occurredAt < b.occurredAt ? 1 : -1,
  );
  const map = new Map<string, PublicEvent[]>();
  for (const e of sorted) {
    const key = dayLabel(e.occurredAt);
    const list = map.get(key);
    if (list) list.push(e);
    else map.set(key, [e]);
  }
  return [...map.entries()];
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** 24-hour, like everywhere else in the product. */
function clock(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
