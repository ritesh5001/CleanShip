import { greece } from "./greece";
import { uae } from "./uae";
import type { Place, Service, SiteContent } from "./types";

/**
 * The site this build is. Chosen once, at build time, by SITE (see
 * next.config.ts), which also refuses to build without it.
 */
export const site: SiteContent = process.env.NEXT_PUBLIC_SITE === "gr" ? greece : uae;

/** The three Cleanship domains, for hreflang on the home page. */
export const domains = {
  main: "https://www.cleanship.co",
  ae: uae.url,
  gr: greece.url,
};

export function getService(slug: string): Service | undefined {
  return site.services.find((s) => s.slug === slug);
}

export function getPlace(slug: string): Place | undefined {
  return site.places.find((p) => p.slug === slug);
}
