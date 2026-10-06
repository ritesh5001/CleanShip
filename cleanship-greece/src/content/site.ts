import { greece } from "./greece";
import type { Place, Service, SiteContent } from "./types";

/** CleanShip Greece — cleanship.gr. All country-specific content lives in greece.ts. */
export const site: SiteContent = greece;

export function getService(slug: string): Service | undefined {
  return site.services.find((s) => s.slug === slug);
}

export function getPlace(slug: string): Place | undefined {
  return site.places.find((p) => p.slug === slug);
}
