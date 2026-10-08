import { and, desc, eq, lte, ne, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { posts, type Post, type PostFaq, type PostSource } from "../db/schema.js";
import { ApiError } from "../http/errors.js";

/**
 * The blog.
 *
 * Drafts are invisible to the public API — `getPublishedBySlug` and
 * `listPublished` filter on status, so a draft URL 404s on the site even if
 * someone guesses it. The admin endpoints see everything.
 *
 * A published post with a future `publishedAt` is scheduled: the public reads
 * also require the date to have passed, so it goes live on its own at that
 * moment (give or take the site's 5-minute cache) with no job to flip it.
 */

/** Published and due: what the public site is allowed to see. */
const isLive = () => and(eq(posts.status, "published"), lte(posts.publishedAt, sql`now()`));

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PostInput = {
  slug: string;
  title: string;
  seoTitle?: string | null;
  description?: string;
  category?: string;
  keywords?: string[];
  lead?: string;
  body?: string;
  faqs?: PostFaq[];
  sources?: PostSource[];
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  authorName?: string;
  authorRole?: string | null;
  status?: "draft" | "published";
  noindex?: boolean;
  publishedAt?: Date | null;
};

/** The fields a listing needs — no body, which is the heavy part. */
const summaryColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  description: posts.description,
  category: posts.category,
  coverImageUrl: posts.coverImageUrl,
  coverImageAlt: posts.coverImageAlt,
  authorName: posts.authorName,
  status: posts.status,
  noindex: posts.noindex,
  publishedAt: posts.publishedAt,
  updatedAt: posts.updatedAt,
  /* Word count without shipping the body: whitespace-separated tokens. */
  words: sql<number>`coalesce(array_length(regexp_split_to_array(trim(${posts.lead} || ' ' || ${posts.body}), '\\s+'), 1), 0)::int`,
};

export function listPublished() {
  return db
    .select(summaryColumns)
    .from(posts)
    .where(isLive())
    .orderBy(desc(posts.publishedAt));
}

export function listAll() {
  return db.select(summaryColumns).from(posts).orderBy(desc(posts.updatedAt));
}

export async function getPublishedBySlug(slug: string): Promise<Post | undefined> {
  const [row] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), isLive()))
    .limit(1);
  return row;
}

export async function getById(id: number): Promise<Post> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!row) throw ApiError.notFound("No such post.");
  return row;
}

async function assertSlugFree(slug: string, exceptId?: number) {
  const [clash] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(exceptId ? and(eq(posts.slug, slug), ne(posts.id, exceptId)) : eq(posts.slug, slug))
    .limit(1);
  if (clash) throw ApiError.badRequest(`slug: "${slug}" is already used by another post.`);
}

/**
 * First publish stamps the date. After that the date is the author's to
 * change (backdating an imported post, say) and is never moved silently.
 */
function publishStamp(input: Partial<PostInput>, current?: Post) {
  const published = (input.status ?? current?.status) === "published";
  /* An explicit date wins — but a published post can never be left undated:
     clearing the field on a live post re-stamps it rather than blanking it. */
  if (input.publishedAt) return input.publishedAt;
  if (published && (input.publishedAt === null || !current?.publishedAt)) return new Date();
  if (input.publishedAt === null) return null;
  return undefined;
}

export async function createPost(input: PostInput): Promise<Post> {
  await assertSlugFree(input.slug);
  const [row] = await db
    .insert(posts)
    .values({ ...input, publishedAt: publishStamp(input) ?? null })
    .returning();
  return row;
}

export async function updatePost(id: number, input: Partial<PostInput>): Promise<Post> {
  const current = await getById(id);
  if (input.slug && input.slug !== current.slug) await assertSlugFree(input.slug, id);
  const stamp = publishStamp(input, current);
  const [row] = await db
    .update(posts)
    .set({
      ...input,
      ...(stamp !== undefined ? { publishedAt: stamp } : {}),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();
  return row;
}

export async function deletePost(id: number) {
  const [row] = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
  if (!row) throw ApiError.notFound("No such post.");
}
