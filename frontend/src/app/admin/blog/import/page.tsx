import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { AdminBar } from "../admin-bar";
import { ImportForm } from "./import-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Import posts", robots: { index: false, follow: false } };

export default async function ImportPostsPage() {
  await requireSession("admin", "superadmin");
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminBar current="blog" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Link href="/admin/blog" className="text-[13px] text-blue-700 hover:underline">← All posts</Link>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Import posts from CSV</h1>
        <p className="mt-1 text-sm text-slate-600">Publish or schedule many posts at once from a spreadsheet.</p>
        <ImportForm />
      </main>
    </div>
  );
}
