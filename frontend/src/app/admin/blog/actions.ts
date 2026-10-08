"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireSession } from "@/lib/session";
import {
  ApiError,
  bulkImportPosts,
  createPost,
  deletePost,
  updatePost,
  type BulkRowResult,
  type PostWrite,
} from "@/lib/api";
import type { ImportPost } from "@/lib/blog-csv";
import { POSTS_TAG } from "@/lib/blog";

export type SaveResult = { ok: true; id: number; slug: string } | { ok: false; error: string };

/** Everything that shows a post, refreshed the moment it changes. */
function refresh(slugs: string[]) {
  revalidateTag(POSTS_TAG);
  revalidatePath("/blog");
  for (const slug of slugs) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/rss.xml");
  revalidatePath("/admin/blog");
}

export async function savePostAction(
  id: number | null,
  data: PostWrite,
  previousSlug?: string,
): Promise<SaveResult> {
  await requireSession("admin", "superadmin");
  try {
    const { post } = id ? await updatePost(id, data) : await createPost(data);
    refresh([post.slug, ...(previousSlug && previousSlug !== post.slug ? [previousSlug] : [])]);
    return { ok: true, id: post.id, slug: post.slug };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof ApiError ? err.message : "Could not save. Try again in a moment.",
    };
  }
}

export async function deletePostAction(id: number, slug: string): Promise<SaveResult> {
  await requireSession("admin", "superadmin");
  try {
    await deletePost(id);
    refresh([slug]);
    return { ok: true, id, slug };
  } catch (err) {
    return { ok: false, error: err instanceof ApiError ? err.message : "Could not delete." };
  }
}

export type ImportResult =
  | { ok: true; written: boolean; results: BulkRowResult[] }
  | { ok: false; error: string };

/** The CSV upload. `dryRun` checks the file; without it, the rows are saved. */
export async function importPostsAction(
  posts: ImportPost[],
  onExisting: "skip" | "update",
  dryRun: boolean,
): Promise<ImportResult> {
  await requireSession("admin", "superadmin");
  try {
    const { written, results } = await bulkImportPosts({ posts, onExisting, dryRun });
    if (written) refresh(results.filter((r) => r.action !== "skip").map((r) => r.slug));
    return { ok: true, written, results };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof ApiError ? err.message : "Could not reach the API. Try again in a moment.",
    };
  }
}
