import { stampOf, type CellStatus, type Stage } from "@/lib/cleantrack/types";
import { NA_GREY, stageShade } from "@/lib/cleantrack/stage-colors";

/**
 * The Time Log: every stage of every hold that has begun, with the time it
 * commenced and the time it completed.
 *
 * Built from the cells themselves rather than from the change history, so
 * each stage appears once with both of its times side by side — the pair a
 * customer checks laytime against. Stages not yet commenced are left out;
 * rows are sorted by their latest time, newest first. Times are the clock
 * times the supervisor recorded, shown unconverted.
 */

type Cell = {
  status: CellStatus;
  startedAt?: string | null;
  completedAt?: string | null;
};

type Props = {
  compartments: { id: number; label: string; cells: Record<string, Cell> }[];
  stages: Stage[];
  /** "dark" on the customer's navy page, "light" inside an office card. */
  tone?: "dark" | "light";
};

const TONE = {
  dark: {
    empty: "m-0 text-[15px] text-white/60",
    head: "font-mono text-[11px] uppercase tracking-[0.12em] text-white/60",
    headRule: "border-white/20",
    rowRule: "border-white/[0.1]",
    hold: "text-white",
    body: "text-white/85",
  },
  light: {
    empty: "m-0 text-[14px] text-slate-500",
    head: "font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500",
    headRule: "border-slate-200",
    rowRule: "border-slate-100",
    hold: "text-slate-900",
    body: "text-slate-700",
  },
} as const;

export function ActivityTimeline({ compartments, stages, tone = "dark" }: Props) {
  const t = TONE[tone];
  const rows = compartments.flatMap((c) =>
    stages.flatMap((s, si) => {
      const cell = c.cells[s.key];
      if (!cell || (!cell.startedAt && !cell.completedAt)) return [];
      return [
        {
          key: `${c.id}-${s.key}`,
          hold: c.label,
          stage: s.label,
          stageIndex: si,
          status: cell.status,
          startedAt: cell.startedAt ?? null,
          completedAt: cell.completedAt ?? null,
          latest: cell.completedAt ?? cell.startedAt ?? "",
        },
      ];
    }),
  );

  if (rows.length === 0) {
    return (
      <p className={t.empty}>
        Nothing has been recorded on this vessel yet.
      </p>
    );
  }

  rows.sort((a, b) => (a.latest < b.latest ? 1 : a.latest > b.latest ? -1 : 0));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className={t.head}>
            <th scope="col" className={`border-b ${t.headRule} py-2 pr-4 font-normal`}>Hold</th>
            <th scope="col" className={`border-b ${t.headRule} py-2 pr-4 font-normal`}>Stage</th>
            <th scope="col" className={`border-b ${t.headRule} py-2 pr-4 font-normal`}>Commenced</th>
            <th scope="col" className={`border-b ${t.headRule} py-2 font-normal`}>Completed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const shade = r.status === "na" ? NA_GREY : stageShade(r.stageIndex);
            return (
              <tr key={r.key} className="text-[14px]">
                <td className={`whitespace-nowrap border-b ${t.rowRule} py-2.5 pr-4 font-semibold ${t.hold}`}>
                  {r.hold}
                </td>
                <td className={`border-b ${t.rowRule} py-2.5 pr-4 ${t.body}`}>
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-3 w-[4px] shrink-0"
                      style={{ background: shade.dark }}
                    />
                    {r.stage}
                  </span>
                </td>
                <td className={`whitespace-nowrap border-b ${t.rowRule} py-2.5 pr-4 font-mono tabular-nums ${t.body}`}>
                  {r.startedAt ? stampOf(r.startedAt) : "—"}
                </td>
                <td className={`whitespace-nowrap border-b ${t.rowRule} py-2.5 font-mono tabular-nums ${t.body}`}>
                  {r.completedAt ? stampOf(r.completedAt) : "In progress"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
