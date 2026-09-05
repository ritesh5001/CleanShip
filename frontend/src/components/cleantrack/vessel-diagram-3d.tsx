"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VesselDiagram, type DiagramCompartment } from "./vessel-diagram";
import {
  STATE_STYLE,
  compartmentNoun,
  compartmentState,
  progressOf,
  type Stage,
  type VesselType,
} from "@/lib/cleantrack/types";
import type { CompartmentView, VesselScene } from "@/lib/cleantrack/vessel-3d";

/**
 * The vessel in 3D.
 *
 * Same props as `VesselDiagram`, deliberately — that component's own comment
 * named its props as the contract a 3D view should honour, so this is a
 * swap-in and the surrounding screens did not have to change.
 *
 * It degrades rather than breaks. No WebGL, a compartment count the models do
 * not cover, or a model that fails to load, and it renders the SVG plan
 * instead. The plan is also one tap away at all times: a supervisor on a windy
 * deck with gloves on wants big flat tap targets, not a hull they have to
 * rotate, and that judgement belongs to whoever is holding the phone.
 *
 * three.js is loaded with a dynamic import so it stays out of the main bundle
 * and off every page that never shows a vessel.
 */

export type VesselDiagram3DProps = {
  compartments: DiagramCompartment[];
  stages: Stage[];
  vesselType: VesselType;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  className?: string;
  /** `state` matches the grid's three colours. `gradient` blends by
   *  percentage — smoother, but then the 3D view and the grid disagree about
   *  what a half-finished hold looks like. */
  colourMode?: "state" | "gradient";
  /** Hide the 3D/Plan switch when the surrounding screen has its own. */
  allowPlanToggle?: boolean;
};

function mixHex(from: string, to: string, t: number) {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const k = Math.max(0, Math.min(1, t));
  const to2 = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${to2(r1 + (r2 - r1) * k)}${to2(g1 + (g2 - g1) * k)}${to2(b1 + (b2 - b1) * k)}`;
}

export function VesselDiagram3D({
  compartments,
  stages,
  vesselType,
  selectedId,
  onSelect,
  className = "",
  colourMode = "state",
  allowPlanToggle = true,
}: VesselDiagram3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<VesselScene | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [mode, setMode] = useState<"3d" | "plan">("3d");

  const count = compartments.length;
  const interactive = Boolean(onSelect);

  /** Everything the scene needs, derived with the app's own helpers so the
   *  colours can never drift from the grid. */
  const views = useMemo<CompartmentView[]>(() => {
    return compartments.map((c) => {
      const statuses = stages.map((s) => c.cells[s.key]?.status ?? "pending");
      const state = compartmentState(statuses);
      const { done, total, ratio } = progressOf(statuses);
      const style = STATE_STYLE[state];
      const fill =
        colourMode === "gradient"
          ? ratio <= 0.5
            ? mixHex(STATE_STYLE["not-started"].fill, STATE_STYLE["in-progress"].fill, ratio * 2)
            : mixHex(STATE_STYLE["in-progress"].fill, STATE_STYLE.complete.fill, (ratio - 0.5) * 2)
          : style.fill;
      return {
        id: c.id,
        label: c.label,
        position: c.position,
        ratio,
        fill,
        edge: style.stroke,
        caption: total === 0 ? "N/A" : `${done}/${total}`,
        open: state === "in-progress" && vesselType === "hold",
      };
    });
  }, [compartments, stages, vesselType, colourMode]);

  /* Refs so the build effect never re-runs just because status changed. */
  const viewsRef = useRef(views);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  viewsRef.current = views;
  selectedRef.current = selectedId;
  onSelectRef.current = onSelect;

  /* Build once per (type, count). Status updates go through `update`, which
     touches only colours, scales and visibility — no reload on every poll. */
  useEffect(() => {
    if (mode !== "3d") return;
    let scene: VesselScene | null = null;
    let cancelled = false;

    (async () => {
      try {
        const mod = await import("@/lib/cleantrack/vessel-3d");
        if (cancelled || !hostRef.current) return;
        if (!mod.webglAvailable()) throw new Error("WebGL unavailable");

        const layout = await mod.loadLayout();
        if (cancelled) return;
        const plan = layout.types[vesselType]?.counts[String(count)];
        if (!plan) {
          throw new Error(
            `no 3D layout for ${count} ${compartmentNoun(vesselType, true).toLowerCase()}`,
          );
        }

        scene = new mod.VesselScene(hostRef.current, {
          interactive,
          onSelect: (id) => onSelectRef.current?.(id),
        });
        sceneRef.current = scene;
        await scene.load(vesselType, count);
        if (cancelled) {
          scene.dispose();
          return;
        }
        scene.update(viewsRef.current);
        scene.setSelected(selectedRef.current ?? null);
        setReady(true);
      } catch (error) {
        if (cancelled) return;
        console.warn("[vessel-3d] falling back to the plan view:", error);
        setFailed(error instanceof Error ? error.message : String(error));
      }
    })();

    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
      setReady(false);
    };
    // Rebuilding is only correct on a change of ship, not of status: status
    // reaches the scene through `update` below.
  }, [vesselType, count, interactive, mode]);

  useEffect(() => {
    if (ready) sceneRef.current?.update(views);
  }, [views, ready]);

  useEffect(() => {
    if (ready) sceneRef.current?.setSelected(selectedId ?? null);
  }, [selectedId, ready]);

  if (failed || mode === "plan") {
    return (
      <div className={className}>
        <VesselDiagram
          compartments={compartments}
          stages={stages}
          vesselType={vesselType}
          selectedId={selectedId}
          onSelect={onSelect}
        />
        {allowPlanToggle && !failed && (
          <ViewSwitch mode="plan" onChange={setMode} />
        )}
      </div>
    );
  }

  const noun = compartmentNoun(vesselType, true).toLowerCase();

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-200/70">
        <div
          ref={hostRef}
          className="h-[280px] w-full cursor-grab active:cursor-grabbing sm:h-[380px]"
          role="img"
          aria-label={`3D view of the vessel showing ${count} ${noun} and their cleaning status`}
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-slate-100/80 text-[13px] text-slate-500">
            Loading vessel…
          </div>
        )}
        <p className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-500/80">
          Drag to rotate · scroll to zoom
        </p>
      </div>

      <Legend />

      {/* The canvas cannot be reached by a keyboard or a screen reader, so the
          same information and the same actions exist here as real buttons. */}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {views.map((v) => {
          const selected = selectedId === v.id;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={onSelect ? () => onSelect(v.id) : undefined}
                disabled={!onSelect}
                aria-pressed={onSelect ? selected : undefined}
                className={`flex items-center gap-1.5 rounded border px-2 py-1 text-[12px] transition ${
                  selected
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                } ${onSelect ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className="inline-block size-2.5 rounded-[2px] border"
                  style={{ background: v.fill, borderColor: v.edge }}
                />
                {v.label}
                <span className="font-mono text-slate-400">{v.caption}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {allowPlanToggle && <ViewSwitch mode="3d" onChange={setMode} />}
    </div>
  );
}

function ViewSwitch({
  mode,
  onChange,
}: {
  mode: "3d" | "plan";
  onChange: (mode: "3d" | "plan") => void;
}) {
  return (
    <div className="mt-3 inline-flex overflow-hidden rounded border border-slate-200 text-[12px]">
      {(["3d", "plan"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          aria-pressed={mode === m}
          className={`px-2.5 py-1 transition ${
            mode === m
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {m === "3d" ? "3D" : "Plan"}
        </button>
      ))}
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
