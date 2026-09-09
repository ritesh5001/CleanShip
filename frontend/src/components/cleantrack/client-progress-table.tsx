import {
  compartmentNoun,
  compartmentState,
  type CellStatus,
  type Stage,
  type VesselType,
} from "@/lib/cleantrack/types";
import { COMPLETE_GREEN, NA_GREY, stageShade } from "@/lib/cleantrack/stage-colors";

/**
 * The whole job as a table, for a customer who wants the detail rather than
 * the picture.
 *
 * Same grid the office works in, read-only and stamped with dates. A customer
 * arguing about laytime needs the date as well as the time — "finished 04:26"
 * is ambiguous on a job that ran three days, and that ambiguity is exactly
 * what the argument turns on. Times are 24-hour for the same reason.
 *
 * Set small on purpose: this is a reference table, and a customer scanning
 * five holds across six stages needs the whole thing in one view far more
 * than they need large type.
 */

type Cell = {
  status: CellStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  updatedAt?: string;
};

type Props = {
  compartments: { id: number; label: string; cells: Record<string, Cell> }[];
  stages: Stage[];
  vesselType: VesselType;
};

const WORD: Record<CellStatus, string> = {
  pending: "—",
  in_progress: "Working",
  done: "Done",
  na: "N/A",
};

export function ClientProgressTable({ compartments, stages, vesselType }: Props) {
  const noun = compartmentNoun(vesselType);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <caption className="sr-only">
          Cleaning progress by {noun.toLowerCase()} and stage
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-white/15 px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-white/45"
            >
              {noun}
            </th>
            {stages.map((s, i) => {
              const shade = stageShade(i);
              return (
                <th key={s.key} scope="col" className="border-b border-white/15 px-2 py-2">
                  <span className="flex flex-col items-center gap-1">
                    <span
                      aria-hidden="true"
                      className="h-[3px] w-full"
                      style={{ background: shade.dark }}
                    />
                    <span className="text-[11px] font-semibold leading-tight text-white/85">
                      {s.short}
                    </span>
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {compartments.map((c, ci) => {
            /* A finished hold drops the per-stage colours for one green, the
               same rule the drawing above follows: once it is ready, "ready"
               is the only fact left worth reading. */
            const whole = compartmentState(
              stages.map((s) => c.cells[s.key]?.status ?? ("pending" as CellStatus)),
            );
            const allDone = whole === "complete";
            return (
            <tr key={c.id}>
              <th
                scope="row"
                className="whitespace-nowrap border-b border-white/[0.08] px-3 py-2 text-left text-[12px] font-semibold text-white/85"
              >
                {/* Numbered from the bow, matching the drawing above. */}
                {ci + 1}
                <span className="ml-1 font-normal text-white/40">{c.label}</span>
              </th>

              {stages.map((s, si) => {
                const cell = c.cells[s.key];
                const status: CellStatus = cell?.status ?? "pending";
                const shade = allDone ? COMPLETE_GREEN : stageShade(si);
                const when = cell?.completedAt ?? cell?.startedAt ?? null;

                const bg =
                  status === "done"
                    ? shade.dark
                    : status === "in_progress"
                      ? shade.light
                      : status === "na"
                        ? NA_GREY.dark
                        : "transparent";
                const fg =
                  status === "done"
                    ? "#ffffff"
                    : status === "in_progress"
                      ? shade.ink
                      : status === "na"
                        ? "#ffffff"
                        : "rgba(255,255,255,0.35)";

                return (
                  <td
                    key={s.key}
                    className="border-b border-white/[0.08] px-1 py-1 text-center align-middle"
                  >
                    <span
                      className="flex min-h-[42px] flex-col items-center justify-center gap-[2px] px-1"
                      style={{
                        background: bg,
                        color: fg,
                        border:
                          status === "pending" ? "1px solid rgba(255,255,255,0.12)" : "none",
                      }}
                    >
                      <span className="text-[11px] font-semibold leading-none">
                        {WORD[status]}
                      </span>
                      {when && (
                        <span className="font-mono text-[9px] leading-none tabular-nums opacity-85">
                          {stamp(when)}
                        </span>
                      )}
                    </span>
                  </td>
                );
              })}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** "07 Sep 04:26" — date and 24-hour time, because a long job needs both. */
function stamp(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
}
