import { BASE_URL } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/blog";

export const revalidate = 300;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 for the blog — feed readers and aggregators pick new posts up from here. */
export async function GET() {
  const posts = (await getPublishedPosts()).filter((p) => !p.noindex).slice(0, 50);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${BASE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${p.slug}</guid>
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ""}
      ${p.category ? `<category>${esc(p.category)}</category>` : ""}
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cleanship Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Hull, hold and tank cleaning guides from Cleanship Marine Services.</description>
    <language>en-gb</language>
    <atom:link href="${BASE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
