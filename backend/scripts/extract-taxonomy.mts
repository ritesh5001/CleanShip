/**
 * Regenerates src/db/seed-data.json from the site's in-code taxonomy.
 *
 * Only useful while `frontend/src/lib/services.ts` is still the source of
 * truth. Once the API owns the content this script is dead — edits happen
 * through the admin, not in code.
 *
 * Paths are relative to this file (backend/scripts/) so the script survives
 * the repo being cloned anywhere.
 *
 *   npx tsx scripts/extract-taxonomy.mts > src/db/seed-data.json
 */
import { serviceCategories } from "../../frontend/src/lib/services.ts";
import {
  categoryCoverage,
  serviceCoverage,
} from "../../frontend/src/lib/site.ts";
import { heroMediaFor } from "../../frontend/src/lib/service-media.ts";

type Coverage = { areas: readonly string[]; worldwide?: boolean } | undefined;

const out = serviceCategories.map((category, categoryIndex) => ({
  slug: category.slug,
  name: category.name,
  seoTitle: category.seoTitle,
  metaDescription: category.metaDescription,
  tagline: category.tagline,
  summary: category.summary,
  intro: category.intro,
  icon: category.icon,
  keywords: category.keywords,
  faqs: category.faqs,
  position: categoryIndex,
  published: true,
  services: category.services.map((service, serviceIndex) => {
    // Per-scope coverage wins; the service line's is the fallback.
    const coverage: Coverage =
      serviceCoverage[service.slug] ?? categoryCoverage[category.slug];
    const media = heroMediaFor(category.slug, service.slug);

    return {
      slug: service.slug,
      name: service.name,
      seoTitle: service.seoTitle,
      metaDescription: service.metaDescription,
      tagline: service.tagline,
      summary: service.summary,
      intro: service.intro,
      highlights: service.highlights,
      scope: service.scope,
      process: service.process,
      appliesTo: service.appliesTo,
      faqs: service.faqs,
      keywords: service.keywords,
      coverageAreas: coverage?.areas ?? [],
      coverageWorldwide: Boolean(coverage?.worldwide),
      mediaSlug: media?.slug ?? null,
      position: serviceIndex,
      published: true,
    };
  }),
}));

process.stdout.write(JSON.stringify(out, null, 2));
