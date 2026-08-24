import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";
import { portPages, shouldIndex } from "@/lib/ports/registry";

/**
 * XML sitemap generated from the service taxonomy, so a new service is
 * submitted to search engines automatically the moment it is added.
 */
/**
 * NO `lastModified` ANYWHERE IN HERE — deliberately.
 *
 * Every URL previously carried the build timestamp, so all 600+ shared one
 * date that changed on every deploy whether the page changed or not. Google
 * treats a lastmod it judges unreliable as noise and stops using it, which
 * costs you the recrawl signal on the pages that genuinely did change. An
 * omitted lastmod is strictly better than a uniform false one.
 *
 * Reinstate it per-URL only when there is a real content source to date it
 * from — a CMS record, or the git commit date of the port entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
      { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.7 },
      { url: `${BASE_URL}/projects`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.8 },
      // Legal pages (lower priority - supplementary content)
      { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${BASE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${BASE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.5 },
    ] as const
  ).map((route) => ({ ...route }));

  /* Standalone landing pages that are NOT part of the generated port
     programme. Everything here self-canonicalises — a page that canonicalises
     to another page must never appear in a sitemap, because listing it says
     "index this" while its canonical says "index that one instead".

     The old thin port pages and the three flat service URLs that used to live
     here are gone: they are 301s now (see next.config.ts). */
  const locationPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/hold-cleaning-in-brazil`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/ports`, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = serviceCategories.map(
    (category) => {
      const media = heroMediaFor(category.slug);
      const still = heroImageFor(category.slug);
      const image = media
        ? `${BASE_URL}/posters/${media.slug}.jpg`
        : still
          ? `${BASE_URL}${still.src}`
          : null;

      return {
        url: `${BASE_URL}/services/${category.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.85,
        ...(image ? { images: [image] } : {}),
      };
    },
  );

  /* Each service declares its hero still as an <image:image> entry. Google
     uses these for Google Images discovery — without them the site's ~30
     photographs are only findable by crawling the pages themselves. */
  const serviceRoutes: MetadataRoute.Sitemap = serviceCategories.flatMap(
    (category) =>
      category.services.map((service) => {
        const media = heroMediaFor(category.slug, service.slug);
        const still = heroImageFor(category.slug, service.slug);
        const image = media
          ? `${BASE_URL}/posters/${media.slug}.jpg`
          : still
            ? `${BASE_URL}${still.src}`
            : null;

        return {
          url: `${BASE_URL}/services/${category.slug}/${service.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.8,
          ...(image ? { images: [image] } : {}),
        };
      }),
  );

  /* Port programme: region hubs, port hubs and port + scope pages across
     every region and service line. Generated from lib/ports so a new port,
     scope or region is submitted the moment it is added — the same contract
     the service taxonomy has.

     Priorities sit below the canonical service pages deliberately. These
     pages target long-tail port intent and should not compete with
     /services/* for the head terms. */
  /* Only indexable pages. The scope pages are noindex, follow — listing a
     noindex URL in a sitemap tells Google "index this" and "do not index
     this" at the same time. They stay discoverable through the port hubs,
     which is what a follow directive is for. */
  const portRoutes: MetadataRoute.Sitemap = portPages
    .filter(shouldIndex)
    .map((page) => {
    const scopeSlug =
      page.kind === "scope"
        ? page.scope.serviceSlug
        : page.line.scopes[0].serviceSlug;
    const media =
      heroMediaFor(page.line.categorySlug, scopeSlug) ??
      heroMediaFor(page.line.categorySlug);
    const still =
      heroImageFor(page.line.categorySlug, scopeSlug) ??
      heroImageFor(page.line.categorySlug);
    const image = media
      ? `${BASE_URL}/posters/${media.slug}.jpg`
      : still
        ? `${BASE_URL}${still.src}`
        : null;

    return {
      url: `${BASE_URL}/${page.slug}`,
      changeFrequency:
        page.kind === "region" ? ("weekly" as const) : ("monthly" as const),
      priority: page.kind === "region" ? 0.8 : page.kind === "port" ? 0.7 : 0.65,
      ...(image ? { images: [image] } : {}),
      };
    });

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...serviceRoutes,
    ...locationPages,
    ...portRoutes,
  ];
}
