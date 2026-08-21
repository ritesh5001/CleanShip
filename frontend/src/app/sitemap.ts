import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";
import { portPages } from "@/lib/ports/registry";

/**
 * XML sitemap generated from the service taxonomy, so a new service is
 * submitted to search engines automatically the moment it is added.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
  ).map((route) => ({ ...route, lastModified: now }));

  /* Standalone landing pages that are NOT part of the generated port
     programme. Everything here self-canonicalises — a page that canonicalises
     to another page cannot rank for its own term, so anything listed here has
     to carry content that earns the listing.

     The old thin port pages that used to live here are gone: they are 301s to
     the port programme now (see next.config.ts). */
  const locationPages: MetadataRoute.Sitemap = (
    [
      { url: `${BASE_URL}/underwater-hull-cleaning`, changeFrequency: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/hold-cleaning-at-port`, changeFrequency: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/hold-cleaning-at-sea`, changeFrequency: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/hold-cleaning-in-brazil`, changeFrequency: "monthly", priority: 0.7 },
    ] as const
  ).map((route) => ({ ...route, lastModified: now }));

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
        lastModified: now,
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
          lastModified: now,
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
  const portRoutes: MetadataRoute.Sitemap = portPages.map((page) => {
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
      lastModified: now,
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
