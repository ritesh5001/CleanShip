import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";

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
    (category) => ({
      url: `${BASE_URL}/services/${category.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    }),
  );

  const serviceRoutes: MetadataRoute.Sitemap = serviceCategories.flatMap(
    (category) =>
      category.services.map((service) => ({
        url: `${BASE_URL}/services/${category.slug}/${service.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  );

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes];
}
