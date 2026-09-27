import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { PostEditor } from "@/components/blog/post-editor";
import { AdminBar } from "../admin-bar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New post", robots: { index: false, follow: false } };

export default async function NewPostPage() {
  const session = await requireSession("admin", "superadmin");
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminBar current="blog" />
      <PostEditor post={null} defaultAuthor={session.name} />
    </div>
  );
}
