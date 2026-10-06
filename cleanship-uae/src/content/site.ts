import { uae } from "./uae";
import type { Place, Service, SiteContent } from "./types";

/** CleanShip UAE — cleanship.ae. All country-specific content lives in uae.ts. */
export const site: SiteContent = uae;

export function getService(slug: string): Service | undefined {
  return site.services.find((s) => s.slug === slug);
}

export function getPlace(slug: string): Place | undefined {
  return site.places.find((p) => p.slug === slug);
}
