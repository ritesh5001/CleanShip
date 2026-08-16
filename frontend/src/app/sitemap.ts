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
      // Legal pages (lower priority - supplementary content)
      { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${BASE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.5 },
      { url: `${BASE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.5 },
    ] as const
  ).map((route) => ({ ...route, lastModified: now }));

  // Location-specific landing pages (with canonical tags pointing to main services)
  // These are supplementary for local SEO targeting
  const locationPages: MetadataRoute.Sitemap = (
    [
      { url: `${BASE_URL}/underwater-hull-cleaning`, changeFrequency: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/hold-cleaning-at-port`, changeFrequency: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/hold-cleaning-at-sea`, changeFrequency: "monthly", priority: 0.65 },
      // UAE Port pages (location-specific landing pages)
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-ruwais-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-uaq-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-ras-ai-khaimah-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-mina-saqr-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-ajman-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-rashid-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-tank-cleaning-service-at-jebel-ali-port`, changeFrequency: "monthly", priority: 0.60 },
      // International location pages
      { url: `${BASE_URL}/hold-cleaning-in-brazil`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-cleaning-in-sharjah`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-cleaning-in-khorfakkan`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/hold-cleaning-in-kakinada-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/cargo-hold-cleaning-in-vizag-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/ship-hold-cleaning-in-kandla-port`, changeFrequency: "monthly", priority: 0.60 },
      { url: `${BASE_URL}/ship-hold-cleaning-in-mumbai-port`, changeFrequency: "monthly", priority: 0.60 },
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

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...locationPages];
}
