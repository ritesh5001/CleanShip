import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${site.url}${path}`;
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: u("/services"), changeFrequency: "monthly", priority: 0.9 },
    ...site.services.map((s) => ({ url: u(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.85, images: [u(s.image)] })),
    { url: u("/ports"), changeFrequency: "monthly", priority: 0.85 },
    ...site.places.map((p) => ({ url: u(`/ports/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: u("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: u("/offices"), changeFrequency: "yearly", priority: 0.6 },
    { url: u("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: u("/privacy-policy"), changeFrequency: "yearly", priority: 0.3 },
    { url: u("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
