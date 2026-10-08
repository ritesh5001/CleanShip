"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { importTemplateCsv, parseImport, type ImportPost, type ParsedImport } from "@/lib/blog-csv";
import type { BulkRowResult } from "@/lib/api";
import { importPostsAction } from "../actions";

type Phase = "idle" | "checked" | "done";

const fmt = (iso: string) =>
  `${new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })} IST`;

function when(post: ImportPost) {
  if (post.status === "draft") return { label: "Draft", tone: "border-slate-300 bg-slate-100 text-slate-600" };
  if (post.publishedAt && new Date(post.publishedAt).getTime() > Date.now()) {
    return { label: `Scheduled · ${fmt(post.publishedAt)}`, tone: "border-amber-400 bg-amber-50 text-amber-800" };
  }
  return {
    label: post.publishedAt ? `Published · ${fmt(post.publishedAt)}` : "Published on import",
    tone: "border-emerald-400 bg-emerald-50 text-emerald-800",
  };
}

const ACTION_LABEL: Record<BulkRowResult["action"], { label: string; tone: string }> = {
  create: { label: "New post", tone: "text-emerald-700" },
  update: { label: "Updates existing", tone: "text-blue-700" },
  skip: { label: "Skipped — slug exists", tone: "text-slate-500" },
  error: { label: "Fix needed", tone: "text-red-700" },
};

export function ImportForm() {
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedImport | null>(null);
  const [onExisting, setOnExisting] = useState<"skip" | "update">("skip");
  const [results, setResults] = useState<BulkRowResult[] | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  /* Every check goes to the API, which knows which slugs are taken. */
  function check(next: ParsedImport, mode: "skip" | "update") {
    setResults(null);
    setError("");
    setPhase("idle");
    if (next.fileErrors.length || next.rows.length === 0) return;
    startTransition(async () => {
      const res = await importPostsAction(next.rows.map((r) => r.post), mode, true);
      if (!res.ok) return setError(res.error);
      setResults(res.results);
      setPhase("checked");
    });
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    const next = parseImport(await file.text());
    setParsed(next);
    check(next, onExisting);
  }

  function runImport() {
    if (!parsed) return;
    startTransition(async () => {
      const res = await importPostsAction(parsed.rows.map((r) => r.post), onExisting, false);
      if (!res.ok) return setError(res.error);
      setResults(res.results);
      setPhase(res.written ? "done" : "checked");
      if (!res.written) setError("Nothing was saved: some rows need fixing first.");
    });
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([importTemplateCsv()], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const rows = (parsed?.rows ?? []).map((r, i) => {
    const server = results?.[i];
    return { ...r, server, errors: [...r.errors, ...(server?.errors ?? [])] };
  });
  const problems = rows.filter((r) => r.errors.length).length;
  const count = (a: BulkRowResult["action"]) => results?.filter((r) => r.action === a).length ?? 0;
  const writes = count("create") + count("update");
  const canImport = phase === "checked" && !pending && problems === 0 && !parsed?.fileErrors.length && writes > 0;

  return (
    <div className="mt-6 space-y-6">
      <section className="border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl text-[14px] leading-relaxed text-slate-700">
            <h2 className="text-[15px] font-semibold text-slate-900">How it works</h2>
            <p className="mt-1">
              One row per post. Start from the template, fill it in Excel or Google Sheets, save as CSV and
              upload it here. Nothing is saved until the whole file checks out, and then every row is saved
              together.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li><b>title</b> is required. <b>slug</b> is made from the title if you leave it empty.</li>
              <li><b>body</b> is Markdown: <code>##</code> and <code>###</code> headings build the table of contents.</li>
              <li>
                <b>status</b>: <code>published</code> (the default), <code>scheduled</code> or <code>draft</code>.
              </li>
              <li>
                <b>publish_at</b> is India time: <code>2026-12-01</code> (goes live at 09:00),{" "}
                <code>2026-12-01 14:30</code> or <code>01/12/2026</code> (day first). A future date schedules
                the post; it appears on the site by itself at that time.
              </li>
              <li><b>keywords</b>: separate with semicolons. <b>noindex</b>: yes or no.</li>
              <li>
                FAQs go in <code>faq1_q</code>, <code>faq1_a</code>, <code>faq2_q</code>… and sources in{" "}
                <code>source1_label</code>, <code>source1_url</code>… Add as many numbered pairs as you need.
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="min-h-10 border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-800 hover:bg-slate-100"
          >
            Download template
          </button>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label htmlFor="csv" className="block text-[13px] font-semibold text-slate-800">CSV file</label>
            <input
              id="csv"
              type="file"
              accept=".csv,text/csv"
              disabled={pending}
              onChange={(e) => {
                void onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
              className="mt-1 block text-[14px] file:mr-3 file:min-h-10 file:border file:border-slate-300 file:bg-slate-50 file:px-4 file:text-[14px] file:font-semibold file:text-slate-800 hover:file:bg-slate-100"
            />
            {fileName && <p className="mt-1 text-[12px] text-slate-500">{fileName}</p>}
          </div>
          <fieldset>
            <legend className="text-[13px] font-semibold text-slate-800">If a post with the same slug already exists</legend>
            <div className="mt-1 flex gap-4 text-[14px] text-slate-700">
              {(["skip", "update"] as const).map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="onExisting"
                    checked={onExisting === mode}
                    disabled={pending}
                    onChange={() => {
                      setOnExisting(mode);
                      if (parsed) check(parsed, mode);
                    }}
                  />
                  {mode === "skip" ? "Skip it" : "Update it (blank cells keep the current value)"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {error && (
        <p role="alert" className="border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>
      )}

      {parsed && parsed.fileErrors.length > 0 && (
        <ul role="alert" className="list-disc border border-red-300 bg-red-50 p-4 pl-8 text-sm text-red-800">
          {parsed.fileErrors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
      {parsed && parsed.warnings.length > 0 && (
        <ul className="list-disc border border-amber-300 bg-amber-50 p-4 pl-8 text-sm text-amber-900">
          {parsed.warnings.map((w) => <li key={w}>{w}</li>)}
        </ul>
      )}

      {phase === "done" ? (
        <div role="status" className="border border-emerald-300 bg-emerald-50 p-5 text-[14px] text-emerald-900">
          <p className="font-semibold">
            Imported: {count("create")} new, {count("update")} updated
            {count("skip") ? `, ${count("skip")} skipped` : ""}.
          </p>
          <p className="mt-1">Scheduled posts stay off the site until their time, then appear by themselves.</p>
          <Link href="/admin/blog" className="mt-3 inline-block font-semibold text-blue-700 hover:underline">
            Back to all posts →
          </Link>
        </div>
      ) : (
        rows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-slate-700">
              {pending && !results
                ? "Checking the file…"
                : results
                  ? problems
                    ? `${problems} of ${rows.length} rows need fixing. Correct the CSV and upload it again.`
                    : `Ready: ${count("create")} new, ${count("update")} to update, ${count("skip")} to skip.`
                  : `${rows.length} rows read.`}
            </p>
            <button
              type="button"
              onClick={runImport}
              disabled={!canImport}
              className="inline-flex min-h-11 items-center bg-blue-700 px-5 text-[14px] font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending && phase === "checked" ? "Importing…" : `Import ${writes} post${writes === 1 ? "" : "s"}`}
            </button>
          </div>
        )
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-slate-50 text-[12px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Row</th>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Goes live</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const w = when(r.post);
                const action = r.errors.length ? ACTION_LABEL.error : r.server ? ACTION_LABEL[r.server.action] : null;
                return (
                  <tr key={r.sheetRow} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 text-slate-500">{r.sheetRow}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{r.post.title || "(no title)"}</div>
                      <div className="mt-0.5 text-[12px] text-slate-500">
                        /blog/{r.post.slug || "—"}
                        {r.post.category ? ` · ${r.post.category}` : ""}
                        {r.post.faqs?.length ? ` · ${r.post.faqs.length} FAQs` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block border px-2 py-0.5 text-[12px] font-semibold ${w.tone}`}>{w.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      {action && <div className={`font-semibold ${action.tone}`}>{action.label}</div>}
                      {r.errors.length > 0 && (
                        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[13px] text-red-700">
                          {r.errors.map((e) => <li key={e}>{e}</li>)}
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
