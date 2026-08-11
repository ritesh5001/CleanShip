/**
 * Maps service and category slugs to their hero footage.
 *
 * Ten clips were supplied. They cover eight services plus two whole service
 * lines, which leaves seven services with no footage of their own — every
 * hold-cleaning and tank-cleaning scope. Those fall back through
 * `heroMediaFor()` to their category clip where one exists, and otherwise to
 * the static navy hero. Nothing renders a broken or empty video frame.
 *
 * When real hold and tank footage arrives, drop it in `videos/`, add the
 * filename to `scripts/compress-videos.sh`, re-run it, and add the slug here.
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
  "ndt-inspection": {
    slug: "ndt-inspection",
    alt: "Technician carrying out non-destructive testing on ship structure",
  },
  "remote-inspection-technology": {
    slug: "remote-inspection-technology",
    alt: "Remote inspection equipment surveying an enclosed space",
  },
  hydroblasting: {
    slug: "hydroblasting",
    alt: "High-pressure water jetting stripping coating from steel",
  },
  "marine-painting": {
    slug: "marine-painting",
    alt: "Marine coating being applied to a vessel's steelwork",
  },
};

/** Whole service lines with footage, used as the fallback for their children. */
const CATEGORY_MEDIA: Record<string, HeroMedia> = {
  offshore: {
    slug: "offshore",
    alt: "Offshore support vessel working alongside an installation",
  },
  "ndt-and-repair": {
    slug: "ndt-and-repair",
    alt: "Inspection and repair work being carried out on board",
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
