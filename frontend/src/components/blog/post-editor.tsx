"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePostAction, savePostAction } from "@/app/admin/blog/actions";
import { PostArticle } from "./post-article";
import {
  readingMinutes,
  slugify,
  tocOf,
  wordCount,
  type Post,
  type PostFaq,
  type PostSource,
} from "@/lib/blog";

/**
 * The blog editor.
 *
 * Every field the public page and its SEO use is here: title and URL, the
 * search-result title and description (with a live Google preview), category
 * and keywords, author, cover image, the intro, the Markdown body, FAQs,
 * sources, publish state, publish date and noindex. The Preview tab renders
 * the post with the same component the live page uses.
 */

type Draft = {
  title: string;
  slug: string;
  seoTitle: string;
  description: string;
  category: string;
  keywords: string;
  lead: string;
  body: string;
  faqs: PostFaq[];
  sources: PostSource[];
  coverImageUrl: string;
  coverImageAlt: string;
  authorName: string;
  authorRole: string;
  noindex: boolean;
  publishedAt: string;
};

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function draftOf(post: Post | null, defaultAuthor: string): Draft {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    seoTitle: post?.seoTitle ?? "",
    description: post?.description ?? "",
    category: post?.category ?? "",
    keywords: (post?.keywords ?? []).join(", "),
    lead: post?.lead ?? "",
    body: post?.body ?? "",
    faqs: post?.faqs ?? [],
    sources: post?.sources ?? [],
    coverImageUrl: post?.coverImageUrl ?? "",
    coverImageAlt: post?.coverImageAlt ?? "",
    authorName: post?.authorName ?? defaultAuthor,
    authorRole: post?.authorRole ?? "",
    noindex: post?.noindex ?? false,
    publishedAt: toLocalInput(post?.publishedAt ?? null),
  };
}

const BODY_STARTER = `## First section heading

Write the section here. Every "##" heading becomes an entry in the contents list, and every "###" becomes a sub-entry.

### A sub-section

- A bullet point
- Another one

## Second section heading

A paragraph with a [link](https://example.com).
`;

const input =
  "w-full min-h-10 border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const label = "mb-1 block text-[12px] font-semibold uppercase tracking-wide text-slate-600";

function Counter({ value, ideal, max }: { value: string; ideal: [number, number]; max: number }) {
  const n = value.length;
  const tone = n === 0 ? "text-slate-400" : n > max ? "text-red-600" : n < ideal[0] || n > ideal[1] ? "text-amber-600" : "text-emerald-700";
  return <span className={`text-[12px] tabular-nums ${tone}`}>{n}/{ideal[1]}</span>;
}

export function PostEditor({ post, defaultAuthor }: { post: Post | null; defaultAuthor: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => draftOf(post, defaultAuthor));
  const [saved, setSaved] = useState<Draft>(() => draftOf(post, defaultAuthor));
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved) || status !== (post?.status ?? "draft");
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  /* Unsaved-changes guard. */
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const payload = useCallback(
    (nextStatus: "draft" | "published") => ({
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      seoTitle: draft.seoTitle.trim() || null,
      description: draft.description.trim(),
      category: draft.category.trim(),
      keywords: draft.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      lead: draft.lead,
      body: draft.body,
      faqs: draft.faqs.filter((f) => f.q.trim() && f.a.trim()),
      sources: draft.sources.filter((s) => s.label.trim() && s.url.trim()),
      coverImageUrl: draft.coverImageUrl.trim() || null,
      coverImageAlt: draft.coverImageAlt.trim() || null,
      authorName: draft.authorName.trim(),
      authorRole: draft.authorRole.trim() || null,
      noindex: draft.noindex,
      status: nextStatus,
      /* Empty means "not set by hand": leave it out so the API keeps the
         existing date, or stamps the moment of first publication. */
      ...(draft.publishedAt ? { publishedAt: new Date(draft.publishedAt).toISOString() } : {}),
    }),
    [draft],
  );

  const save = useCallback(
    (nextStatus: "draft" | "published") => {
      setMessage(null);
      startTransition(async () => {
        const result = await savePostAction(post?.id ?? null, payload(nextStatus), post?.slug);
        if (!result.ok) {
          setMessage({ kind: "error", text: result.error });
          return;
        }
        setStatus(nextStatus);
        setSaved(draft);
        setMessage({
          kind: "ok",
          text: nextStatus === "published" ? "Published — the live page is updated." : "Saved as draft.",
        });
        if (!post) router.replace(`/admin/blog/${result.id}`);
        else router.refresh();
      });
    },
    [draft, payload, post, router],
  );

  /* Cmd/Ctrl+S saves in the current state. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!pending) save(status);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, save, status]);

  function remove() {
    if (!post) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deletePostAction(post.id, post.slug);
      if (!result.ok) {
        setMessage({ kind: "error", text: result.error });
        return;
      }
      setSaved(draft);
      router.replace("/admin/blog");
    });
  }

  /* Markdown toolbar: wraps the selection, or inserts a snippet at the cursor. */
  function insert(before: string, after = "", placeholder = "") {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const selected = value.slice(a, b) || placeholder;
    const next = value.slice(0, a) + before + selected + after + value.slice(b);
    set("body", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + before.length, a + before.length + selected.length);
    });
  }
  const line = (prefix: string, placeholder: string) => {
    const el = bodyRef.current;
    const atLineStart = !el || el.selectionStart === 0 || el.value[el.selectionStart - 1] === "\n";
    insert(`${atLineStart ? "" : "\n\n"}${prefix}`, "", placeholder);
  };

  const toc = useMemo(() => tocOf(draft.body), [draft.body]);
  const words = wordCount({ lead: draft.lead, body: draft.body });
  const seoTitle = draft.seoTitle || draft.title;

  const checks = [
    { ok: seoTitle.length >= 30 && seoTitle.length <= 48, text: "Search title is 30–48 characters (+ \" | Cleanship\")" },
    { ok: draft.description.length >= 120 && draft.description.length <= 160, text: "Meta description is 120–160 characters" },
    { ok: toc.filter((t) => t.level === 2).length >= 2, text: "At least two ## section headings" },
    { ok: words >= 600, text: `Body is 600+ words (now ${words})` },
    { ok: draft.keywords.split(",").filter((k) => k.trim()).length >= 3, text: "Three or more keywords" },
    { ok: !draft.coverImageUrl || draft.coverImageAlt.trim().length > 0, text: "Cover image has alt text" },
    { ok: draft.faqs.filter((f) => f.q && f.a).length >= 2, text: "Two or more FAQs (FAQ rich results)" },
    { ok: Boolean(draft.authorName.trim()), text: "Author name set" },
  ];

  const previewPost: Post = {
    id: post?.id ?? 0,
    ...payload(status),
    keywords: draft.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    faqs: draft.faqs.filter((f) => f.q && f.a),
    sources: draft.sources.filter((s) => s.label && s.url),
    seoTitle: draft.seoTitle || null,
    coverImageUrl: draft.coverImageUrl || null,
    coverImageAlt: draft.coverImageAlt || null,
    authorRole: draft.authorRole || null,
    status,
    publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : post?.publishedAt ?? null,
    createdAt: post?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tool = (text: string, title: string, onClick: () => void) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="min-h-8 border border-slate-300 bg-white px-2.5 text-[13px] font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-700"
    >
      {text}
    </button>
  );

  /* Saved as published with a future date: the public site hides it until then. */
  const scheduled =
    status === "published" && !!post?.publishedAt && new Date(post.publishedAt).getTime() > Date.now();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Top bar: title, state and the three actions. */}
      <div className="sticky top-[72px] z-20 lg:top-[116px] -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <Link href="/admin/blog" className="text-[13px] text-blue-700 hover:underline">← All posts</Link>
          <h1 className="truncate text-xl font-bold text-slate-900">{draft.title || (post ? "Untitled" : "New post")}</h1>
          <p className="text-[12px] text-slate-500">
            <span
              className={`mr-2 inline-block border px-1.5 text-[11px] font-semibold ${
                scheduled
                  ? "border-amber-400 text-amber-700"
                  : status === "published"
                    ? "border-emerald-400 text-emerald-700"
                    : "border-slate-300 text-slate-600"
              }`}
            >
              {scheduled ? "scheduled" : status}
            </span>
            {dirty ? "Unsaved changes" : "All changes saved"} · {words} words · {readingMinutes(words)} min read
            {status === "published" && post && !scheduled && (
              <>
                {" · "}
                <a href={`/blog/${post.slug}`} target="_blank" className="text-blue-700 hover:underline">View live ↗</a>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post && (
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="min-h-10 border border-red-300 bg-white px-4 text-[14px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          )}
          {status === "published" ? (
            <>
              <button
                type="button"
                onClick={() => save("draft")}
                disabled={pending}
                className="min-h-10 border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
              >
                Unpublish
              </button>
              <button
                type="button"
                onClick={() => save("published")}
                disabled={pending}
                className="min-h-10 bg-blue-700 px-5 text-[14px] font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Update live post"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => save("draft")}
                disabled={pending}
                className="min-h-10 border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save draft"}
              </button>
              <button
                type="button"
                onClick={() => save("published")}
                disabled={pending}
                className="min-h-10 bg-emerald-700 px-5 text-[14px] font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                Publish
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`mt-4 border px-4 py-3 text-[14px] ${
            message.kind === "error" ? "border-red-300 bg-red-50 text-red-800" : "border-emerald-300 bg-emerald-50 text-emerald-800"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-5 flex gap-1 border-b border-slate-200">
        {(["edit", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-[14px] font-semibold capitalize ${
              tab === t ? "border-blue-700 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t === "edit" ? "Write" : "Preview"}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div className="mt-4 border border-slate-200">
          <PostArticle post={previewPost} preview />
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ---------------- Main column ---------------- */}
          <div className="space-y-6">
            <div>
              <label className={label} htmlFor="title">Title (H1)</label>
              <input
                id="title"
                className={`${input} text-[18px] font-semibold`}
                value={draft.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                placeholder="Cargo Hold Preparation Standards"
              />
            </div>

            <div>
              <label className={label} htmlFor="slug">URL</label>
              <div className="flex items-center border border-slate-300 bg-white focus-within:border-blue-600">
                <span className="pl-3 text-[14px] text-slate-400">cleanship.co/blog/</span>
                <input
                  id="slug"
                  className="min-h-10 flex-1 bg-transparent px-1 py-2 text-[14px] outline-none"
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
                  }}
                />
              </div>
              {post && status === "published" && draft.slug !== post.slug && (
                <p className="mt-1 text-[12px] text-amber-700">
                  Changing the URL of a published post breaks existing links to it.
                </p>
              )}
            </div>

            <div>
              <label className={label} htmlFor="lead">Intro (shown under the title — Markdown allowed)</label>
              <textarea
                id="lead"
                rows={4}
                className={input}
                value={draft.lead}
                onChange={(e) => set("lead", e.target.value)}
                placeholder="One or two paragraphs that tell the reader what this article answers."
              />
            </div>

            <div>
              <div className="mb-1 flex items-end justify-between">
                <label className={label} htmlFor="body">Body (Markdown)</label>
                {!draft.body && (
                  <button type="button" onClick={() => set("body", BODY_STARTER)} className="text-[12px] text-blue-700 hover:underline">
                    Insert starter template
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 border border-b-0 border-slate-300 bg-slate-100 p-1.5">
                {tool("H2", "Section heading (appears in contents)", () => line("## ", "Section heading"))}
                {tool("H3", "Sub-section heading", () => line("### ", "Sub-section heading"))}
                {tool("B", "Bold", () => insert("**", "**", "bold text"))}
                {tool("I", "Italic", () => insert("_", "_", "italic text"))}
                {tool("Link", "Link", () => insert("[", "](https://)", "link text"))}
                {tool("• List", "Bullet list", () => line("- ", "List item"))}
                {tool("1. List", "Numbered list", () => line("1. ", "First step"))}
                {tool("Quote", "Quote / callout", () => line("> ", "Quoted text"))}
                {tool("Table", "Table", () =>
                  line("| Column | Column |\n| --- | --- |\n| Cell | Cell |\n", ""),
                )}
                {tool("Image", "Image", () => insert("![", "](https://)", "Describe the image"))}
                {tool("—", "Divider", () => line("---\n", ""))}
              </div>
              <textarea
                id="body"
                ref={bodyRef}
                rows={28}
                className={`${input} font-mono text-[13.5px] leading-relaxed`}
                value={draft.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder={"## Section heading\n\nWrite here…"}
                spellCheck
              />
              <p className="mt-1 text-[12px] text-slate-500">
                <code>##</code> section · <code>###</code> sub-section · <code>**bold**</code> · <code>[text](url)</code> ·{" "}
                <code>- list</code> · tables with <code>|</code>. Headings become the contents list and #anchor links.
              </p>
            </div>

            {/* FAQs */}
            <fieldset className="border border-slate-200 bg-white p-4">
              <legend className="px-1 text-[13px] font-semibold text-slate-800">
                FAQs <span className="font-normal text-slate-500">— shown at the end and sent to Google as FAQ data</span>
              </legend>
              <div className="space-y-4">
                {draft.faqs.map((f, i) => (
                  <div key={i} className="border-l-2 border-blue-200 pl-3">
                    <input
                      className={input}
                      placeholder="Question"
                      value={f.q}
                      onChange={(e) => set("faqs", draft.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                    />
                    <textarea
                      rows={3}
                      className={`${input} mt-2`}
                      placeholder="Answer"
                      value={f.a}
                      onChange={(e) => set("faqs", draft.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                    />
                    <button
                      type="button"
                      onClick={() => set("faqs", draft.faqs.filter((_, j) => j !== i))}
                      className="mt-1 text-[12px] text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => set("faqs", [...draft.faqs, { q: "", a: "" }])}
                className="mt-3 text-[13px] font-semibold text-blue-700 hover:underline"
              >
                + Add FAQ
              </button>
            </fieldset>

            {/* Sources */}
            <fieldset className="border border-slate-200 bg-white p-4">
              <legend className="px-1 text-[13px] font-semibold text-slate-800">
                Sources &amp; further reading <span className="font-normal text-slate-500">— regulations, standards, references</span>
              </legend>
              <div className="space-y-3">
                {draft.sources.map((s, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      className={input}
                      placeholder="Label, e.g. IMO: IMSBC Code"
                      value={s.label}
                      onChange={(e) =>
                        set("sources", draft.sources.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                      }
                    />
                    <input
                      className={input}
                      placeholder="https://…"
                      value={s.url}
                      onChange={(e) =>
                        set("sources", draft.sources.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => set("sources", draft.sources.filter((_, j) => j !== i))}
                      className="text-[12px] text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => set("sources", [...draft.sources, { label: "", url: "" }])}
                className="mt-3 text-[13px] font-semibold text-blue-700 hover:underline"
              >
                + Add source
              </button>
            </fieldset>
          </div>

          {/* ---------------- Sidebar ---------------- */}
          <aside className="space-y-5">
            <section className="border border-slate-200 bg-white p-4">
              <h2 className="text-[13px] font-semibold text-slate-800">Search engine listing</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between">
                    <label className={label} htmlFor="seoTitle">SEO title</label>
                    <Counter value={seoTitle} ideal={[30, 48]} max={60} />
                  </div>
                  <input
                    id="seoTitle"
                    className={input}
                    value={draft.seoTitle}
                    onChange={(e) => set("seoTitle", e.target.value)}
                    placeholder={draft.title || "Defaults to the title"}
                  />
                  <p className="mt-1 text-[11px] text-slate-500">&ldquo; | Cleanship&rdquo; (12 characters) is added automatically, so keep this to 48 or Google cuts it off.</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <label className={label} htmlFor="description">Meta description</label>
                    <Counter value={draft.description} ideal={[120, 160]} max={320} />
                  </div>
                  <textarea
                    id="description"
                    rows={4}
                    className={input}
                    value={draft.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="What the reader will learn, in one or two sentences."
                  />
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Google preview</p>
                  <p className="mt-1 truncate text-[12px] text-slate-600">cleanship.co › blog › {draft.slug || "…"}</p>
                  <p className="truncate text-[17px] leading-snug text-[#1a0dab]">{(seoTitle || "Title") + " | Cleanship"}</p>
                  <p className="line-clamp-2 text-[13px] text-slate-600">
                    {draft.description || "Your meta description appears here."}
                  </p>
                </div>
                <div>
                  <label className={label} htmlFor="keywords">Keywords (comma separated)</label>
                  <input
                    id="keywords"
                    className={input}
                    value={draft.keywords}
                    onChange={(e) => set("keywords", e.target.value)}
                    placeholder="hold cleaning, grain clean standard, IMSBC Code"
                  />
                </div>
                <label className="flex items-start gap-2 text-[13px] text-slate-700">
                  <input type="checkbox" checked={draft.noindex} onChange={(e) => set("noindex", e.target.checked)} className="mt-0.5" />
                  <span>Hide from search engines (noindex). The post stays reachable by link.</span>
                </label>
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-4">
              <h2 className="text-[13px] font-semibold text-slate-800">SEO checklist</h2>
              <ul className="mt-2 space-y-1.5">
                {checks.map((c) => (
                  <li key={c.text} className="flex items-start gap-2 text-[13px]">
                    <span className={c.ok ? "text-emerald-600" : "text-slate-300"}>{c.ok ? "✓" : "○"}</span>
                    <span className={c.ok ? "text-slate-700" : "text-slate-500"}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border border-slate-200 bg-white p-4">
              <h2 className="text-[13px] font-semibold text-slate-800">Contents (from your headings)</h2>
              {toc.length === 0 ? (
                <p className="mt-2 text-[13px] text-slate-500">Add ## headings to the body to build the contents list.</p>
              ) : (
                <ol className="mt-2 space-y-1 text-[13px] text-slate-700">
                  {toc.map((t) => (
                    <li key={t.id} className={t.level === 3 ? "pl-4 text-slate-500" : ""}>
                      {t.text} <span className="text-slate-400">#{t.id}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="space-y-3 border border-slate-200 bg-white p-4">
              <h2 className="text-[13px] font-semibold text-slate-800">Details</h2>
              <div>
                <label className={label} htmlFor="category">Category</label>
                <input
                  id="category"
                  className={input}
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="Hold cleaning"
                />
              </div>
              <div>
                <label className={label} htmlFor="authorName">Author</label>
                <input id="authorName" className={input} value={draft.authorName} onChange={(e) => set("authorName", e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="authorRole">Author role</label>
                <input
                  id="authorRole"
                  className={input}
                  value={draft.authorRole}
                  onChange={(e) => set("authorRole", e.target.value)}
                  placeholder="Diving Supervisor, 15 years in-water survey"
                />
              </div>
              <div>
                <label className={label} htmlFor="publishedAt">Publish date</label>
                <input
                  id="publishedAt"
                  type="datetime-local"
                  className={input}
                  value={draft.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Leave empty to use the moment you publish. A future date schedules the post: it stays off the site until then.
                </p>
              </div>
            </section>

            <section className="space-y-3 border border-slate-200 bg-white p-4">
              <h2 className="text-[13px] font-semibold text-slate-800">Cover image</h2>
              <div>
                <label className={label} htmlFor="coverImageUrl">Image URL</label>
                <input
                  id="coverImageUrl"
                  className={input}
                  value={draft.coverImageUrl}
                  onChange={(e) => set("coverImageUrl", e.target.value)}
                  placeholder="https://… or /images/…"
                />
              </div>
              <div>
                <label className={label} htmlFor="coverImageAlt">Alt text</label>
                <input
                  id="coverImageAlt"
                  className={input}
                  value={draft.coverImageAlt}
                  onChange={(e) => set("coverImageAlt", e.target.value)}
                  placeholder="Diver cleaning a sea chest grating"
                />
              </div>
              {draft.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary URL
                <img src={draft.coverImageUrl} alt="" className="w-full border border-slate-200" />
              )}
              <p className="text-[11px] text-slate-500">Also used as the image when the post is shared on social media.</p>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
