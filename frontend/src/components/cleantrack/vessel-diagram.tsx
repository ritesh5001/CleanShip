"use client";

import {
  STATE_STYLE,
  compartmentNoun,
  progressOf,
  stateOf,
  type JobType,
} from "@cleanship/backend/cleantrack/stages";

export type DiagramCompartment = {
  id: number;
  label: string;
  position: number;
  completed: string[];
};

/**
 * 2D plan view of the vessel.
 *
 * WHY SVG AND NOT A 3D HULL
 *
 * The build plan proposes Three.js. This is the 2D version, and for the job it
 * has to do it is not a downgrade. A supervisor is holding a phone on a windy
 * deck with gloves on: they need to hit the right hold first time. A plan view
 * with rectangles gives large, unambiguous tap targets that never rotate away
 * from the finger. A rotatable hull looks better in a demo and is worse to
 * use, and it costs ~600KB of JavaScript on a dock connection.
 *
 * The geometry is computed, not drawn: any compartment count from 1 to ~20
 * lays out correctly, because a real job has whatever number of holds the
 * vessel has and hardcoding five would be useless on the sixth job.
 *
 * If the 3D view is built later, this component's props are the contract it
 * should honour — the surrounding screens should not need to change.
 */
export function VesselDiagram({
  compartments,
  jobType,
  selectedId,
  onSelect,
  className = "",
}: {
  compartments: DiagramCompartment[];
  jobType: JobType;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  className?: string;
}) {
  const n = Math.max(compartments.length, 1);

  /* Viewbox is fixed; the hull scales to it. Bow right, stern left — the
     orientation the paper sheet uses. */
  const W = 1000;
  const H = 260;
  const bowLength = 150;
  const sternLength = 110;
  const margin = 18;
  const bodyStart = sternLength;
  const bodyEnd = W - bowLength;
  const bodyWidth = bodyEnd - bodyStart;
  const gap = 10;
  const cellW = (bodyWidth - gap * (n - 1)) / n;
  const top = margin + 26;
  const bottom = H - margin - 8;
  const cellH = bottom - top;

  const hullPath = [
    `M ${margin} ${top - 14}`,
    `L ${bodyEnd} ${top - 14}`,
    `Q ${W - margin} ${H / 2} ${bodyEnd} ${bottom + 14}`,
    `L ${margin} ${bottom + 14}`,
    "Z",
  ].join(" ");

  const interactive = Boolean(onSelect);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Vessel plan showing ${n} ${compartmentNoun(jobType, n !== 1).toLowerCase()} and their cleaning status`}
      >
        {/* Hull outline */}
        <path d={hullPath} fill="#f2f6f9" stroke="#0a2e52" strokeWidth={3} />

        {/* Accommodation block at the stern — reads as "this end is aft"
            without needing a label. */}
        <rect
          x={margin + 10}
          y={top - 4}
          width={sternLength - margin - 24}
          height={cellH * 0.62}
          rx={2}
          fill="#0a2e52"
          opacity={0.85}
        />
        <text
          x={margin + 10 + (sternLength - margin - 24) / 2}
          y={top + cellH * 0.62 + 18}
          textAnchor="middle"
          fontSize={13}
          fill="#4c5c6b"
        >
          AFT
        </text>
        <text
          x={bodyEnd + bowLength / 2 - 10}
          y={H / 2 + 5}
          textAnchor="middle"
          fontSize={13}
          fill="#4c5c6b"
        >
          FWD
        </text>

        {compartments.map((c, i) => {
          const state = stateOf(c.completed ?? [], jobType);
          const style = STATE_STYLE[state];
          const { done, total } = progressOf(c.completed ?? [], jobType);
          const x = bodyStart + i * (cellW + gap);
          const selected = selectedId === c.id;
          /* Fill from the bottom in proportion to stages done — the bar and
             the diagram then tell the same story at a glance. */
          const fillH = cellH * (done / total);

          const Tag = interactive ? "g" : "g";
          return (
            <Tag
              key={c.id}
              onClick={interactive ? () => onSelect?.(c.id) : undefined}
              onKeyDown={
                interactive
                  ? (e: React.KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect?.(c.id);
                      }
                    }
                  : undefined
              }
              tabIndex={interactive ? 0 : undefined}
              role={interactive ? "button" : undefined}
              aria-pressed={interactive ? selected : undefined}
              aria-label={
                interactive
                  ? `${c.label}, ${style.label}, ${done} of ${total} stages`
                  : undefined
              }
              className={
                interactive
                  ? "cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-blue-600 [&:focus-visible>rect:first-child]:stroke-[4]"
                  : undefined
              }
            >
              <rect
                x={x}
                y={top}
                width={cellW}
                height={cellH}
                rx={3}
                fill={style.fill}
                stroke={selected ? "#014ba8" : style.stroke}
                strokeWidth={selected ? 4 : 2}
              />
              {done > 0 && (
                <rect
                  x={x}
                  y={top + cellH - fillH}
                  width={cellW}
                  height={fillH}
                  rx={3}
                  fill={style.stroke}
                  opacity={0.18}
                />
              )}
              <text
                x={x + cellW / 2}
                y={top + cellH / 2 - 4}
                textAnchor="middle"
                fontSize={Math.min(22, cellW / 3.2)}
                fontWeight={700}
                fill={style.text}
              >
                {/* "Hold 3" -> "3" when the cell is narrow. */}
                {cellW < 70 ? c.label.replace(/^\D+/, "") : c.label}
              </text>
              <text
                x={x + cellW / 2}
                y={top + cellH / 2 + 20}
                textAnchor="middle"
                fontSize={Math.min(15, cellW / 4.6)}
                fill={style.text}
                opacity={0.8}
              >
                {done}/{total}
              </text>
            </Tag>
          );
        })}
      </svg>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-slate-600">
      {(["not-started", "in-progress", "complete"] as const).map((s) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className="inline-block size-3.5 rounded-[2px] border"
            style={{
              background: STATE_STYLE[s].fill,
              borderColor: STATE_STYLE[s].stroke,
            }}
          />
          {STATE_STYLE[s].label}
        </li>
      ))}
    </ul>
  );
}
