import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";

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

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes];
}
