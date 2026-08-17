/**
 * Maps service and category slugs to their hero footage.
 *
 * Every CleanHull scope has footage of its own, so `heroMediaFor()` never
 * falls back — but the fallback path is kept so a new scope added without a
 * clip renders the static navy hero rather than an empty video frame.
 */

export type HeroMedia = {
  /** Basename shared by the mp4, webm and poster files. */
  slug: string;
  /**
   * Alt text for the poster. These clips are ambient background footage, so
   * the text describes the operation rather than narrating the shot.
   */
  alt: string;
};

/** Services with footage of their own. */
const SERVICE_MEDIA: Record<string, HeroMedia> = {
  "underwater-hull-cleaning": {
    slug: "underwater-hull-cleaning",
    alt: "Diver cleaning marine growth from a vessel's underwater hull",
  },
  "thruster-cleaning-polishing": {
    slug: "thruster-cleaning-polishing",
    alt: "Diver working inside a bow thruster tunnel",
  },
  "propeller-super-polishing": {
    slug: "propeller-super-polishing",
    alt: "Diver polishing a ship's propeller blade underwater",
  },
  "in-water-class-survey": {
    slug: "in-water-class-survey",
    alt: "Diver carrying out an in-water class survey on a vessel's hull",
  },
  // UWILD is an in-water survey carried out for drydocking credit, so the
  // in-water survey footage is the correct operation, not a stand-in.
  uwild: {
    slug: "in-water-class-survey",
    alt: "Diver carrying out an underwater inspection in lieu of drydocking",
  },
};

/** The hull-cleaning line leads with its flagship scope's footage. */
const CATEGORY_MEDIA: Record<string, HeroMedia> = {
  "hull-cleaning": {
    slug: "underwater-hull-cleaning",
    alt: "Diver cleaning marine growth from a vessel's underwater hull",
  },
};

/**
 * Resolves the clip for a page, preferring the service's own footage and
 * falling back to its category's. Returns null when neither exists — callers
 * must handle that and render the static hero.
 */
export function heroMediaFor(
  categorySlug: string,
  serviceSlug?: string,
): HeroMedia | null {
  if (serviceSlug && SERVICE_MEDIA[serviceSlug]) {
    return SERVICE_MEDIA[serviceSlug];
  }
  return CATEGORY_MEDIA[categorySlug] ?? null;
}
