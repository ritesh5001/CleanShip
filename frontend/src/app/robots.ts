import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* /admin is also noindex via src/app/admin/layout.tsx — belt and
           braces, because a disallow alone does not remove an already-indexed
           URL, and a noindex alone still burns crawl budget. */
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
