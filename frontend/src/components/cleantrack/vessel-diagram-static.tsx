"use client";

import { VesselDiagram3D } from "./vessel-diagram-3d";
import type { DiagramCompartment } from "./vessel-diagram";
import type { Stage, VesselType } from "@/lib/cleantrack/types";

/**
 * The diagram without interaction, for customer-facing views.
 *
 * A separate wrapper rather than a prop on the page, so no customer screen can
 * accidentally pass an `onSelect` and make a read-only view look editable to
 * somebody who cannot edit it.
 *
 * This is the 3D vessel. A customer looking at their ship should see their
 * ship. It falls back to the SVG plan on its own if WebGL is missing or the
 * models cannot load, so a customer never gets a blank card.
 */
export function VesselDiagramStatic(props: {
  compartments: DiagramCompartment[];
  stages: Stage[];
  vesselType: VesselType;
  className?: string;
}) {
  return <VesselDiagram3D {...props} />;
}
