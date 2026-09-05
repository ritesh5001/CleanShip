"use client";

import { useEffect, useState } from "react";
import { VesselDiagramStatic } from "./vessel-diagram-static";
import { Vessel3D, canRender3D, type Vessel3DCompartment } from "./vessel-3d";
import type { CellStatus, Stage, VesselType } from "@/lib/cleantrack/types";

/**
 * Picks how to draw the vessel: 3D where we have a model, the 2D plan
 * otherwise.
 *
 * The 2D diagram stays the floor, not a legacy path. It is what renders on the
 * server, on a vessel with more compartments than we model, and on any device
 * where WebGL will not start — a customer on an old phone must still be able
 * to see which holds are done.
 *
 * That is also why the 3D view mounts only after hydration: three.js is
 * ~600KB, and a page whose whole job is "is my vessel ready" should paint the
 * answer before it starts fetching a renderer.
 */
export function VesselScene({
  compartments,
  stages,
  vesselType,
  className = "",
}: {
  compartments: (Vessel3DCompartment & {
    position: number;
    cells: Record<string, { status: CellStatus; note: string | null }>;
  })[];
  stages: Stage[];
  vesselType: VesselType;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!canRender3D(vesselType, compartments.length)) return;

    /* Respect a reduced-motion preference: the 3D view is draggable and
       shaded, and someone who has asked for less movement should get the
       flat plan instead. */
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    setUse3D(!reduced);
  }, [mounted, vesselType, compartments.length]);

  const flat = (
    <VesselDiagramStatic
      className={className}
      compartments={compartments.map((c) => ({
        id: c.id,
        label: c.label,
        position: c.position,
        cells: c.cells,
      }))}
      stages={stages}
      vesselType={vesselType}
    />
  );

  if (!use3D) return flat;

  return (
    <div className={className}>
      <Vessel3D
        compartments={compartments.map((c) => ({
          id: c.id,
          label: c.label,
          state: c.state,
        }))}
        vesselType={vesselType}
      />
      <p className="mt-1 text-center text-[12px] text-slate-500">
        Drag to turn the vessel. Bow is forward of hold 1.
      </p>
      {/* The plan view stays available underneath: the 3D model shows which
          compartment is which, but reading an exact status off a shaded box at
          an angle is harder than reading a flat one. */}
      <details className="mt-3">
        <summary className="cursor-pointer text-[13px] font-medium text-blue-700">
          Show flat plan
        </summary>
        <div className="mt-2">{flat}</div>
      </details>
    </div>
  );
}
