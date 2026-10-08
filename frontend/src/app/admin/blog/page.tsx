import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { listAllPosts } from "@/lib/api";
import { formatPostDate, readingMinutes, type PostSummary } from "@/lib/blog";
import { AdminBar } from "./admin-bar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog", robots: { index: false, follow: false } };

export default async function AdminBlogPage() {
  await requireSession("admin", "superadmin");

  let posts: PostSummary[] = [];
  let failed = false;
  try {
    posts = (await listAllPosts()).posts;
  } catch (err) {
    console.error("[admin/blog] API unavailable", err);
    failed = true;
  }
  /* A published post dated in the future is scheduled: the public API hides
     it until that moment. Counted apart so "published" means "live". */
  const now = Date.now();
  const isScheduled = (p: PostSummary) =>
    p.status === "published" && !!p.publishedAt && new Date(p.publishedAt).getTime() > now;
  const scheduled = posts.filter(isScheduled).length;
  const published = posts.filter((p) => p.status === "published").length - scheduled;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminBar current="blog" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Blog</h1>
            <p className="mt-1 text-sm text-slate-600">
              {posts.length} posts · {published} published · {scheduled} scheduled ·{" "}
              {posts.length - published - scheduled} drafts ·{" "}
              <a href="/blog" target="_blank" className="text-blue-700 hover:underline">View blog ↗</a>
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex min-h-11 items-center bg-blue-700 px-5 text-[14px] font-semibold text-white hover:bg-blue-800"
          >
            + New post
          </Link>
        </div>

        {failed ? (
          <p className="mt-6 border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            Could not reach the API. It may be starting up — refresh in a moment.
          </p>
        ) : posts.length === 0 ? (
          <div className="mt-6 border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-base font-semibold text-slate-900">No posts yet</h2>
            <p className="mt-2 text-sm text-slate-600">Write the first one — it stays a draft until you publish it.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-slate-50 text-[12px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <Link href={`/admin/blog/${p.id}`} className="font-semibold text-slate-900 hover:text-blue-700">
                        {p.title}
                      </Link>
                      <div className="mt-0.5 text-[12px] text-slate-500">
                        /blog/{p.slug} · {readingMinutes(p.words)} min read
                        {p.noindex ? " · noindex" : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[12px] font-semibold ${
                          isScheduled(p)
                            ? "border-amber-400 bg-amber-50 text-amber-800"
                            : p.status === "published"
                              ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                              : "border-slate-300 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isScheduled(p) ? "scheduled" : p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatPostDate(p.publishedAt) || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatPostDate(p.updatedAt)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link href={`/admin/blog/${p.id}`} className="text-blue-700 hover:underline">Edit</Link>
                      {p.status === "published" && !isScheduled(p) && (
                        <a href={`/blog/${p.slug}`} target="_blank" className="ml-3 text-blue-700 hover:underline">
                          View ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
