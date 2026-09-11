import {
  compartmentNoun,
  compartmentState,
  progressOf,
  type CellStatus,
  type Stage,
  type VesselType,
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
 * The bow is drawn on the RIGHT — the ship faces right, stern to the left —
 * and holds are numbered from the bow, which is how they are numbered at sea:
 * Hold 1 is the forward-most, so it is the rightmost hold in this drawing.
 *
 * The geometry is built bow-left first, in the shape that is easiest to
 * reason about (a point at x=0, a transom further along x), and then
 * reflected as a whole — `flip(x) = w - x` applied to every coordinate. That
 * is a genuine mirror: every control point moves, so the curves stay exactly
 * as drawn, just facing the other way. Deriving the mirrored Bezier points by
 * hand would be the same shape by construction, but far easier to get subtly
 * wrong.
 */

type PlanCompartment = {
  id: number;
  position: number;
  label: string;
  cells: Record<string, { status: CellStatus }>;
  /** A gang is physically in this compartment right now, 0 or 1. */
  active?: number;
};

type Props = {
  compartments: PlanCompartment[];
  stages: Stage[];
  vesselType: VesselType;
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

/** Crew presence, drawn distinctly from the amber "stage under way" pulse. */
const CREW_AQUA = "#00b0b9";

export function VesselPlanView({
  compartments,
  stages,
  vesselType,
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

  /** Mirrors an x-coordinate across the canvas: bow-left becomes bow-right. */
  const flip = (x: number) => w - x;

  /* Built bow-left, in the easy-to-read shape: a point at the stem, parallel
     sides through the cargo block, a rounded transom. Every coordinate is
     then reflected with `flip`, which is what puts the bow on the right. */
  const bodyX0 = bowLen;
  const bodyX1 = bowLen + body;
  const sternX = bodyX1 + sternLen;
  const stem = 8;
  const deckTop = top - 14;
  const deckBot = top + holdH + 14;
  const hull = [
    `M ${flip(stem)} ${midY}`,
    /* Forward shoulder: flares from the stem out to full beam. */
    `C ${flip(bowLen * 0.34)} ${deckTop} ${flip(bowLen * 0.62)} ${deckTop} ${flip(bodyX0)} ${deckTop}`,
    /* Parallel middle body — the part that actually holds cargo. */
    `L ${flip(bodyX1)} ${deckTop}`,
    /* Quarter and transom. */
    `Q ${flip(sternX)} ${deckTop} ${flip(sternX)} ${midY}`,
    `Q ${flip(sternX)} ${deckBot} ${flip(bodyX1)} ${deckBot}`,
    `L ${flip(bodyX0)} ${deckBot}`,
    `C ${flip(bowLen * 0.62)} ${deckBot} ${flip(bowLen * 0.34)} ${deckBot} ${flip(stem)} ${midY}`,
    "Z",
  ].join(" ");

  return (
    <figure className={`m-0 ${className ?? ""}`}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={`Plan view of ${n} ${compartmentNoun(vesselType, true).toLowerCase()}, bow to the right, numbered from the bow`}
          style={{ minWidth: Math.min(w, 640), width: "100%", height: "auto", display: "block" }}
        >
          <style>{`
            @keyframes ct-pulse {
              0%   { transform: scale(1);   opacity: 0.75; }
              70%  { transform: scale(2.6); opacity: 0; }
              100% { transform: scale(2.6); opacity: 0; }
            }
            .ct-pulse {
              transform-box: fill-box;
              transform-origin: center;
              animation: ct-pulse 1.8s ease-out infinite;
            }
            /* A blinking marker is exactly what someone with vestibular or
               attention sensitivities asks the OS to stop; the dot stays, the
               movement goes. */
            @media (prefers-reduced-motion: reduce) {
              .ct-pulse { animation: none; opacity: 0.35; }
            }
          `}</style>

          <path d={hull} fill={g.hull} stroke={g.edge} strokeWidth="2" />

          {/* Centreline — a real drawing convention, and it reads as one. */}
          <line
            x1={flip(14)}
            y1={midY}
            x2={flip(sternX - 6)}
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
            const crewAboard = Boolean(c.active);
            const selected = selectedId === c.id;

            /* Hold 0 is "Hold No. 1", the bow-most compartment — the API
               stores compartments in that order. Its bow-left x is the
               smallest (closest to the stem); flipping the hold's own left
               edge is what moves it to the ship's new bow, on the right. */
            const bowLeftX = bowLen + i * (holdW + gap);
            const x = flip(bowLeftX) - holdW;
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

                {/* Crew physically in this hold right now — a fact a
                    supervisor sets by hand, and deliberately not the same
                    marker as "stage under way" below: that pulses amber above
                    the hold, this sits steady, aqua, inside its top corner. A
                    hold can be mid-stage with nobody in it between shifts, and
                    the two questions ("what stage" vs "is anyone there")
                    should never share one dot. */}
                {crewAboard && (
                  <circle cx={x + 12} cy={top + 12} r="5" fill={CREW_AQUA}>
                    <title>Crew aboard</title>
                  </circle>
                )}

                {/* A hold with a stage under way gets a pulsing dot above it.
                    A finished hold does not — it needs no attention, and a
                    dot on every hold would say nothing. */}
                {working && (
                  <g>
                    <circle
                      className="ct-pulse"
                      cx={x + holdW / 2}
                      cy={top - 13}
                      r="6"
                      fill="#d6a90a"
                    />
                    <circle
                      cx={x + holdW / 2}
                      cy={top - 13}
                      r="6"
                      fill="#d6a90a"
                      stroke="#fdf3c4"
                      strokeWidth="2"
                    >
                      <title>Work under way</title>
                    </circle>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption
        className={`mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] ${g.caption}`}
      >
        <span>Stern</span>
        <span aria-hidden="true">&larr; holds numbered from the bow &rarr;</span>
        <span>Bow</span>
      </figcaption>
    </figure>
  );
}
