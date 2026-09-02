"use client";

import { VesselDiagram, type DiagramCompartment } from "./vessel-diagram";
import type { JobType } from "@/lib/stages";

/**
 * The diagram without interaction, for client-facing views.
 *
 * A separate wrapper rather than a prop on the page, so no client screen can
 * accidentally pass an `onSelect` and make a read-only view look editable to
 * somebody who cannot edit it.
 */
export function VesselDiagramStatic(props: {
  compartments: DiagramCompartment[];
  jobType: JobType;
  className?: string;
}) {
  return <VesselDiagram {...props} />;
}
