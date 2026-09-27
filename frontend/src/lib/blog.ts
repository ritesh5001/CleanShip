import GithubSlugger from "github-slugger";

/**
 * The blog: shapes, public reads and the helpers the article layout needs.
 *
 * Posts live in the API's database and are written in the admin panel
 * (/admin/blog). Public reads are cached and tagged "posts", so saving a post
 * in the editor calls revalidateTag("posts") and the site updates at once
 * instead of waiting out the cache.
 *
 * Safe to import from client components: nothing here touches cookies or
 * secrets. The authenticated admin calls are in lib/api.ts.
 */

export type PostFaq = { q: string; a: string };
export type PostSource = { label: string; url: string };

export type Post = {
  id: number;
  slug: string;
  title: string;
  seoTitle: string | null;
  description: string;
  category: string;
  keywords: string[];
  lead: string;
  body: string;
  faqs: PostFaq[];
  sources: PostSource[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  authorName: string;
  authorRole: string | null;
  status: "draft" | "published";
  noindex: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostSummary = Pick<
  Post,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "category"
  | "coverImageUrl"
  | "coverImageAlt"
  | "authorName"
  | "status"
  | "noindex"
  | "publishedAt"
  | "updatedAt"
> & { words: number };

export const POSTS_TAG = "posts";

const API = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

/** Public reads. A failure returns empty rather than throwing: a blog index
    that errors because the API is asleep is worse than one that is briefly
    empty, and the next revalidation fills it. */
async function publicGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api/v1/posts${path}`, {
      next: { revalidate: 300, tags: [POSTS_TAG] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error("[blog] API unavailable", err);
    return null;
  }
}

export async function getPublishedPosts(): Promise<PostSummary[]> {
  return (await publicGet<{ posts: PostSummary[] }>(""))?.posts ?? [];
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return (await publicGet<{ post: Post }>(`/slug/${slug}`))?.post ?? null;
}

/* -------------------------------------------------------------------- */
/* Article helpers                                                       */
/* -------------------------------------------------------------------- */

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** Markdown inline syntax off a heading, so the TOC shows plain text. */
function plainHeading(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

/**
 * The table of contents: every `##` and `###` in the body, with the same ids
 * rehype-slug gives the rendered headings (both use github-slugger, in
 * document order, so duplicate headings get the same -1, -2 suffixes).
 * Fenced code blocks are skipped so a `## ` inside code is not a heading.
 */
export function tocOf(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = plainHeading(m[2]);
    /* Every heading advances the slugger, as rehype-slug does, even the
       levels the TOC does not list — otherwise ids drift out of step. */
    const id = slugger.slug(text);
    if (m[1].length === 2 || m[1].length === 3) {
      items.push({ id, text, level: m[1].length as 2 | 3 });
    }
  }
  return items;
}

export function wordCount(post: Pick<Post, "lead" | "body">) {
  return `${post.lead} ${post.body}`.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 220));
}

export function formatPostDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

/** Category label to URL segment: "Hold cleaning" → "hold-cleaning". */
export function categorySlug(category: string) {
  return slugify(category) || "general";
}
