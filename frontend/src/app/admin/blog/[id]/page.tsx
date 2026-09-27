import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { ApiError, getPostForEdit } from "@/lib/api";
import { PostEditor } from "@/components/blog/post-editor";
import { AdminBar } from "../admin-bar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit post", robots: { index: false, follow: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession("admin", "superadmin");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  let post;
  try {
    post = (await getPostForEdit(id)).post;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminBar current="blog" />
      <PostEditor post={post} defaultAuthor={session.name} />
    </div>
  );
}
