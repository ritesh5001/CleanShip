import {
  CELL_STYLE,
  compartmentState,
  progressOf,
  statusesOf,
  type CompartmentDetail,
  type CompartmentState,
  type Stage,
} from "@/lib/cleantrack/types";

/**
 * The vessel as a plan view — the drawing a master or a chartering desk
 * already reads.
 *
 * This replaces a WebGL model of the hull. An owner reads a plan view of their
 * own ship faster than a rendered one, it costs nothing on a phone in a
 * meeting, and it is the only graphic on the customer page that answers the
 * one question they came with: which hold is holding me up.
 *
 * It is drawn from the same four cell colours the crew taps, so a customer on
 * the phone and a supervisor in the hold are looking at one picture.
 */

type Props = {
  compartments: CompartmentDetail[];
  stages: Stage[];
};

/**
 * Hold fills, keyed to the rolled-up state rather than to any single cell.
 *
 * Fill and edge come from CELL_STYLE so this drawing cannot drift from the
 * grid the crew taps. Only the label colours are local: they are the readable
 * ink on each of those fills, which the shared token set does not carry.
 */
const HOLD_FILL: Record<CompartmentState, { bg: string; text: string; edge: string }> = {
  complete: {
    bg: CELL_STYLE.done.fill,
    text: "#14400a",
    edge: CELL_STYLE.done.stroke,
  },
  "in-progress": {
    bg: CELL_STYLE.in_progress.fill,
    text: "#7d5c00",
    edge: CELL_STYLE.in_progress.stroke,
  },
  "not-started": { bg: "rgba(255,255,255,0.07)", text: "#b9c5cf", edge: "rgba(255,255,255,0.22)" },
};

export function VesselPlanView({ compartments, stages }: Props) {
  /* Geometry is computed from the compartment count rather than fixed, because
     a vessel can carry anything from 5 holds to 9 and the drawing has to stay
     the same shape either way. */
  const n = compartments.length;
  const holdW = 92;
  const gap = 8;
  const padX = 46; // room for the stern transom and the bow taper
  const bodyW = n * holdW + (n - 1) * gap;
  const w = bodyW + padX * 2;
  const h = 132;
  const holdH = 76;
  const holdY = (h - holdH) / 2;

  /* Plan view, bow to the right: a squared transom, parallel sides through the
     cargo block, then a taper to a point at the stem. */
  const hull = [
    `M ${padX * 0.34} ${holdY - 16}`,
    `L ${padX + bodyW + 6} ${holdY - 16}`,
    `Q ${w - 2} ${h / 2} ${padX + bodyW + 6} ${holdY + holdH + 16}`,
    `L ${padX * 0.34} ${holdY + holdH + 16}`,
    `Q ${padX * 0.1} ${h / 2} ${padX * 0.34} ${holdY - 16}`,
    "Z",
  ].join(" ");

  return (
    <figure className="m-0">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={`Plan view of ${n} compartments, stern to bow`}
          style={{ minWidth: Math.min(w, 560), width: "100%", height: "auto", display: "block" }}
        >
          <path d={hull} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />

          {/* Centreline — a real drawing convention, and it reads as one. */}
          <line
            x1={padX * 0.34}
            y1={h / 2}
            x2={padX + bodyW + 10}
            y2={h / 2}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
            strokeDasharray="7 6"
          />

          {compartments.map((c, i) => {
            const statuses = statusesOf(c, stages);
            const state = compartmentState(statuses);
            const pct = Math.round(progressOf(statuses).ratio * 100);
            const skin = HOLD_FILL[state];
            const x = padX + i * (holdW + gap);
            return (
              <g key={c.id}>
                <rect
                  x={x}
                  y={holdY}
                  width={holdW}
                  height={holdH}
                  rx="3"
                  fill={skin.bg}
                  stroke={skin.edge}
                  strokeWidth="1.5"
                />
                <text
                  x={x + holdW / 2}
                  y={holdY + 32}
                  textAnchor="middle"
                  fill={skin.text}
                  style={{ font: "700 22px/1 var(--font-display), sans-serif" }}
                >
                  {c.position}
                </text>
                <text
                  x={x + holdW / 2}
                  y={holdY + 56}
                  textAnchor="middle"
                  fill={skin.text}
                  style={{
                    font: "500 13px/1 var(--font-mono), monospace",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {pct}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/45">
        <span>Stern</span>
        <span aria-hidden="true">&rarr;</span>
        <span>Bow</span>
      </figcaption>
    </figure>
  );
}
