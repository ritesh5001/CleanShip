"use client";

import { VesselDiagram, type DiagramCompartment } from "./vessel-diagram";
import type { Stage, VesselType } from "@/lib/cleantrack/types";

/**
 * The diagram without interaction, for customer-facing views.
 *
 * A separate wrapper rather than a prop on the page, so no customer screen can
 * accidentally pass an `onSelect` and make a read-only view look editable to
 * somebody who cannot edit it.
 */
export function VesselDiagramStatic(props: {
  compartments: DiagramCompartment[];
  stages: Stage[];
  vesselType: VesselType;
  className?: string;
}) {
  return <VesselDiagram {...props} />;
}
