import {
  compartmentState,
  progressOf,
  type CellStatus,
  type Stage,
} from "@/lib/cleantrack/types";
import {
  COMPLETE_GREEN,
  NA_GREY,
  stageShade,
} from "@/lib/cleantrack/stage-colors";

/**
 * The vessel as a plan view — the drawing a master or a chartering desk
 * already reads.
 *
 * This replaces a WebGL model of the hull. An owner reads a plan view of their
 * own ship faster than a rendered one, it costs nothing on a phone in a
 * meeting, and it is the only graphic on the customer page that answers the
 * one question they came with: which hold is holding me up.
 *
 * Each hold carries one block per stage, so the drawing shows not just how far
 * a hold has got but which part of the job it is in. Light means under way,
 * dark means finished, and a hold with everything done drops the per-stage
 * colours for a single green — at that point "ready" is the only fact left
 * worth reading.
 *
 * Numbering runs from the bow, which is how holds are numbered at sea: Hold 1
 * is the forward-most. The bow is drawn on the left so that hold 1 is also the
 * first thing read.
 */

type PlanCompartment = {
  id: number;
  position: number;
  label: string;
  cells: Record<string, { status: CellStatus }>;
};

type Props = {
  compartments: PlanCompartment[];
  stages: Stage[];
  tone?: "dark" | "light";
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  className?: string;
};

const GROUND = {
  dark: {
    hull: "rgba(255,255,255,0.05)",
    edge: "rgba(255,255,255,0.34)",
    line: "rgba(255,255,255,0.16)",
    empty: "rgba(255,255,255,0.08)",
    emptyEdge: "rgba(255,255,255,0.20)",
    num: "#ffffff",
    caption: "text-white/45",
    ring: "#00b0b9",
  },
  light: {
    hull: "#f1f7fc",
    edge: "#8a9aa8",
    line: "#c8d2dc",
    empty: "#ffffff",
    emptyEdge: "#c8d2dc",
    num: "#0f1c27",
    caption: "text-slate-400",
    ring: "#1461a0",
  },
} as const;

export function VesselPlanView({
  compartments,
  stages,
  tone = "dark",
  selectedId = null,
  onSelect,
  className,
}: Props) {
  const g = GROUND[tone];
  const n = compartments.length;

  const holdW = 96;
  const gap = 10;
  const holdH = 96;
  const bowLen = 96; // the tapered forward section
  const sternLen = 34; // the squared-off transom
  const body = n * holdW + (n - 1) * gap;
  const w = bowLen + body + sternLen + 24;
  const h = 170;
  const top = 30;
  const midY = top + holdH / 2;

  /* Bow left, stern right.
     A hull, not a lozenge: it comes to a point at the stem, runs parallel
     through the cargo block where the holds are, and rounds off at the
     transom. Those three sections are what make a plan view read as a ship,
     and they are drawn as three explicit parts rather than one smooth blob. */
  const bodyX0 = bowLen;
  const bodyX1 = bowLen + body;
  const sternX = bodyX1 + sternLen;
  const stem = 8;
  const deckTop = top - 14;
  const deckBot = top + holdH + 14;
  const hull = [
    `M ${stem} ${midY}`,
    /* Forward shoulder: flares from the stem out to full beam. */
    `C ${bowLen * 0.34} ${deckTop} ${bowLen * 0.62} ${deckTop} ${bodyX0} ${deckTop}`,
    /* Parallel middle body — the part that actually holds cargo. */
    `L ${bodyX1} ${deckTop}`,
    /* Quarter and transom. */
    `Q ${sternX} ${deckTop} ${sternX} ${midY}`,
    `Q ${sternX} ${deckBot} ${bodyX1} ${deckBot}`,
    `L ${bodyX0} ${deckBot}`,
    `C ${bowLen * 0.62} ${deckBot} ${bowLen * 0.34} ${deckBot} ${stem} ${midY}`,
    "Z",
  ].join(" ");

  return (
    <figure className={`m-0 ${className ?? ""}`}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={`Plan view of ${n} compartments, numbered from the bow`}
          style={{ minWidth: Math.min(w, 640), width: "100%", height: "auto", display: "block" }}
        >
          <path d={hull} fill={g.hull} stroke={g.edge} strokeWidth="2" />

          {/* Centreline — a real drawing convention, and it reads as one. */}
          <line
            x1={14}
            y1={midY}
            x2={sternX - 6}
            y2={midY}
            stroke={g.line}
            strokeWidth="1"
            strokeDasharray="8 7"
          />

          {compartments.map((c, i) => {
            const statuses = stages.map(
              (s) => c.cells[s.key]?.status ?? ("pending" as CellStatus),
            );
            const state = compartmentState(statuses);
            const pct = Math.round(progressOf(statuses).ratio * 100);
            const done = state === "complete";
            const working = state === "in-progress";
            const x = bowLen + i * (holdW + gap);
            const selected = selectedId === c.id;

            /* No reversal needed: the API already stores compartments in
               order from forward — position 0 is "Hold No. 1", the bow-most —
               and the bow is drawn on the left, so array order and the numbers
               on the drawing run the same way. The count is 1-based here only
               because `position` is stored 0-based, which is what put a "0" on
               the customer's drawing. */
            const number = i + 1;

            const blockW = (holdW - 16 - (stages.length - 1) * 3) / stages.length;

            return (
              <g
                key={c.id}
                onClick={onSelect ? () => onSelect(c.id) : undefined}
                style={onSelect ? { cursor: "pointer" } : undefined}
              >
                <rect
                  x={x}
                  y={top}
                  width={holdW}
                  height={holdH}
                  fill={done ? COMPLETE_GREEN.light : g.empty}
                  stroke={selected ? g.ring : done ? COMPLETE_GREEN.dark : g.emptyEdge}
                  strokeWidth={selected ? 3 : 1.5}
                />

                {/* One block per stage. Light = under way, dark = finished. */}
                {stages.map((s, si) => {
                  const st = c.cells[s.key]?.status ?? "pending";
                  const shade =
                    st === "na" ? NA_GREY : done ? COMPLETE_GREEN : stageShade(si);
                  const fill =
                    st === "done"
                      ? shade.dark
                      : st === "in_progress"
                        ? shade.light
                        : st === "na"
                          ? NA_GREY.dark
                          : "transparent";
                  return (
                    <rect
                      key={s.key}
                      x={x + 8 + si * (blockW + 3)}
                      y={top + 34}
                      width={blockW}
                      height={26}
                      fill={fill}
                      stroke={st === "pending" ? g.emptyEdge : "none"}
                      strokeWidth="1"
                    >
                      <title>{`${s.label}: ${st.replace("_", " ")}`}</title>
                    </rect>
                  );
                })}

                <text
                  x={x + holdW / 2}
                  y={top + 24}
                  textAnchor="middle"
                  fill={done ? COMPLETE_GREEN.ink : g.num}
                  style={{ font: "700 20px/1 var(--font-display), sans-serif" }}
                >
                  {number}
                </text>

                <text
                  x={x + holdW / 2}
                  y={top + holdH - 10}
                  textAnchor="middle"
                  fill={done ? COMPLETE_GREEN.ink : g.num}
                  style={{
                    font: "500 12px/1 var(--font-mono), monospace",
                    fontVariantNumeric: "tabular-nums",
                    opacity: 0.85,
                  }}
                >
                  {pct}%
                </text>

                {/* A hold with work under way gets a dot above it. A finished
                    hold does not — it needs no attention, and a dot on every
                    hold would say nothing. */}
                {working && (
                  <circle cx={x + holdW / 2} cy={top - 12} r="5" fill="#d6a90a">
                    <title>Work under way</title>
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption
        className={`mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] ${g.caption}`}
      >
        <span>Bow</span>
        <span aria-hidden="true">&larr; holds numbered from forward &rarr;</span>
        <span>Stern</span>
      </figcaption>
    </figure>
  );
}
