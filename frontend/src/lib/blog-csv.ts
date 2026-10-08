import { slugify, type PostFaq, type PostSource } from "./blog";
import { parseCsv, toCsv } from "./csv";

/**
 * CSV ↔ blog posts, for the bulk import in /admin/blog/import.
 *
 * One row is one post. Runs in the browser so the admin sees a preview and
 * every problem before anything is sent; the API then validates the rows
 * against the same schema as the editor, so this file is about reading the
 * spreadsheet well, not about being the last word on what a post may hold.
 *
 * Empty cells are left out of the post rather than sent as "", which is what
 * makes "update existing posts" safe: a blank cell leaves that field alone.
 */

/** What the API's bulk endpoint takes per row. */
export type ImportPost = {
  slug: string;
  title: string;
  seoTitle?: string;
  description?: string;
  category?: string;
  keywords?: string[];
  lead?: string;
  body?: string;
  faqs?: PostFaq[];
  sources?: PostSource[];
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorName?: string;
  authorRole?: string;
  status: "draft" | "published";
  noindex?: boolean;
  publishedAt?: string;
};

export type ImportRow = {
  /** The row's line in the spreadsheet: the header is row 1. */
  sheetRow: number;
  post: ImportPost;
  errors: string[];
};

export type ParsedImport = { rows: ImportRow[]; fileErrors: string[]; warnings: string[] };

/** Dates without an offset are read as India time: the office's clock. */
const IST_OFFSET_MINUTES = 330;
const DEFAULT_PUBLISH_HOUR = 9;

const FIELDS: Record<string, keyof ImportPost> = {
  slug: "slug",
  url: "slug",
  title: "title",
  seotitle: "seoTitle",
  description: "description",
  metadescription: "description",
  category: "category",
  keywords: "keywords",
  tags: "keywords",
  lead: "lead",
  intro: "lead",
  excerpt: "lead",
  body: "body",
  content: "body",
  coverimageurl: "coverImageUrl",
  coverimage: "coverImageUrl",
  image: "coverImageUrl",
  coverimagealt: "coverImageAlt",
  imagealt: "coverImageAlt",
  authorname: "authorName",
  author: "authorName",
  authorrole: "authorRole",
  status: "status",
  publishat: "publishedAt",
  publishedat: "publishedAt",
  publishdate: "publishedAt",
  date: "publishedAt",
  noindex: "noindex",
};

const key = (header: string) => header.toLowerCase().replace(/[^a-z0-9]/g, "");

type Column =
  | { kind: "field"; field: keyof ImportPost }
  | { kind: "faq"; n: number; part: "q" | "a" }
  | { kind: "source"; n: number; part: "label" | "url" };

function columnFor(header: string): Column | null {
  const k = key(header);
  if (FIELDS[k]) return { kind: "field", field: FIELDS[k] };
  const faq = /^faq(\d+)(q|question|a|answer)$/.exec(k);
  if (faq) return { kind: "faq", n: Number(faq[1]), part: faq[2].startsWith("q") ? "q" : "a" };
  const src = /^source(\d+)(label|title|name|url|link)$/.exec(k);
  if (src) return { kind: "source", n: Number(src[1]), part: /url|link/.test(src[2]) ? "url" : "label" };
  return null;
}

/**
 * "2026-10-25", "2026-10-25 14:30", "25/10/2026", "25-10-2026 9:00 AM" are
 * India time; anything carrying its own offset ("…T03:30:00Z", "+05:30") is
 * taken as written. A date with no time publishes at 09:00. Day-first for
 * slashes, because that is how Excel writes dates back out in India and the UK.
 */
export function parsePublishAt(raw: string): Date | null {
  const s = raw.trim();
  if (/T.*(Z|[+-]\d{2}:?\d{2})$/i.test(s)) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const time = String.raw`(?:[ T](\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?)?`;
  let y: number, mo: number, d: number, hh: string | undefined, mm: string | undefined, ap: string | undefined;
  let m = new RegExp(String.raw`^(\d{4})-(\d{1,2})-(\d{1,2})${time}$`, "i").exec(s);
  if (m) [, y, mo, d, hh, mm, ap] = [m[0], +m[1], +m[2], +m[3], m[4], m[5], m[6]];
  else {
    m = new RegExp(String.raw`^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})${time}$`, "i").exec(s);
    if (!m) return null;
    [, d, mo, y, hh, mm, ap] = [m[0], +m[1], +m[2], +m[3], m[4], m[5], m[6]];
  }
  let hour = hh === undefined ? DEFAULT_PUBLISH_HOUR : +hh;
  const minute = mm === undefined ? 0 : +mm;
  if (ap) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (ap.toLowerCase() === "pm" ? 12 : 0);
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || hour > 23 || minute > 59) return null;
  const utc = Date.UTC(y, mo - 1, d, hour, minute) - IST_OFFSET_MINUTES * 60_000;
  const check = new Date(utc + IST_OFFSET_MINUTES * 60_000);
  /* 31/02 rolls over to March in Date.UTC; refuse it rather than move it. */
  if (check.getUTCDate() !== d || check.getUTCMonth() !== mo - 1) return null;
  return new Date(utc);
}

function parseStatus(raw: string): ImportPost["status"] | null {
  const s = raw.trim().toLowerCase();
  if (s === "" || ["published", "publish", "live", "scheduled", "schedule"].includes(s)) return "published";
  if (s === "draft") return "draft";
  return null;
}

function parseBool(raw: string): boolean | null {
  const s = raw.trim().toLowerCase();
  if (["true", "yes", "y", "1"].includes(s)) return true;
  if (["false", "no", "n", "0", ""].includes(s)) return false;
  return null;
}

export function parseImport(text: string): ParsedImport {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], fileErrors: ["The file is empty."], warnings: [] };

  const [header, ...data] = table;
  const columns = header.map(columnFor);
  const warnings = header
    .filter((h, i) => h.trim() && !columns[i])
    .map((h) => `Column "${h}" isn't one the import knows, so it was ignored.`);
  const has = (f: keyof ImportPost) => columns.some((c) => c?.kind === "field" && c.field === f);
  const fileErrors = has("title") ? [] : ['The file needs a "title" column.'];
  if (data.length === 0) fileErrors.push("The file has a header row but no posts.");

  const rows = data.map((cells, i): ImportRow => {
    const errors: string[] = [];
    const text: Partial<Record<keyof ImportPost, string>> = {};
    const faqs = new Map<number, { q?: string; a?: string }>();
    const sources = new Map<number, { label?: string; url?: string }>();

    columns.forEach((col, c) => {
      const value = (cells[c] ?? "").replace(/\r\n?/g, "\n").trim();
      if (!col || value === "") return;
      if (col.kind === "field") text[col.field] = value;
      else if (col.kind === "faq") faqs.set(col.n, { ...faqs.get(col.n), [col.part]: value });
      else sources.set(col.n, { ...sources.get(col.n), [col.part]: value });
    });

    const title = text.title ?? "";
    if (!title) errors.push("Title is empty.");
    const slug = text.slug ? text.slug.toLowerCase() : slugify(title);

    const status = parseStatus(text.status ?? "");
    if (!status) errors.push(`Status "${text.status}" should be published, scheduled or draft.`);

    let publishedAt: string | undefined;
    if (text.publishedAt) {
      const d = parsePublishAt(text.publishedAt);
      if (d) publishedAt = d.toISOString();
      else errors.push(`Can't read the publish date "${text.publishedAt}". Use 2026-10-25 or 2026-10-25 09:00.`);
    }

    const noindex = parseBool(text.noindex ?? "");
    if (noindex === null) errors.push(`noindex "${text.noindex}" should be yes or no.`);

    const faqList: PostFaq[] = [];
    for (const [n, f] of [...faqs].sort((a, b) => a[0] - b[0])) {
      if (f.q && f.a) faqList.push({ q: f.q, a: f.a });
      else errors.push(`FAQ ${n} has a ${f.q ? "question but no answer" : "answer but no question"}.`);
    }
    const sourceList: PostSource[] = [];
    for (const [n, s] of [...sources].sort((a, b) => a[0] - b[0])) {
      if (s.url) sourceList.push({ label: s.label || s.url, url: s.url });
      else errors.push(`Source ${n} has a label but no URL.`);
    }

    const post: ImportPost = {
      slug,
      title,
      status: status ?? "draft",
      ...(text.seoTitle && { seoTitle: text.seoTitle }),
      ...(text.description && { description: text.description }),
      ...(text.category && { category: text.category }),
      ...(text.keywords && {
        keywords: text.keywords.split(/[;,\n]/).map((k) => k.trim()).filter(Boolean),
      }),
      ...(text.lead && { lead: text.lead }),
      ...(text.body && { body: text.body }),
      ...(faqList.length && { faqs: faqList }),
      ...(sourceList.length && { sources: sourceList }),
      ...(text.coverImageUrl && { coverImageUrl: text.coverImageUrl }),
      ...(text.coverImageAlt && { coverImageAlt: text.coverImageAlt }),
      ...(text.authorName && { authorName: text.authorName }),
      ...(text.authorRole && { authorRole: text.authorRole }),
      ...(noindex && { noindex }),
      ...(publishedAt && { publishedAt }),
    };
    return { sheetRow: i + 2, post, errors };
  });

  return { rows, fileErrors, warnings };
}

/* -------------------------------------------------------------------- */
/* The template the admin downloads                                      */
/* -------------------------------------------------------------------- */

const TEMPLATE_HEADER = [
  "slug",
  "title",
  "seo_title",
  "description",
  "category",
  "keywords",
  "lead",
  "body",
  "cover_image_url",
  "cover_image_alt",
  "author_name",
  "author_role",
  "status",
  "publish_at",
  "noindex",
  "faq1_q",
  "faq1_a",
  "faq2_q",
  "faq2_a",
  "faq3_q",
  "faq3_a",
  "source1_label",
  "source1_url",
  "source2_label",
  "source2_url",
];

const TEMPLATE_EXAMPLE = [
  "example-hold-cleaning-post",
  "Example: how to prepare cargo holds for a grain survey",
  "Preparing Cargo Holds for a Grain Survey",
  "One or two sentences for Google results, under about 160 characters.",
  "Hold cleaning",
  "grain clean; hold inspection; bulk carrier hold cleaning",
  "The opening paragraph, shown large above the article.",
  "## First section heading\n\nBody text in Markdown. ## and ### headings build the table of contents.\n\n- Bullet points work\n- So do [links](/contact)\n\n## Second section heading\n\nMore text.",
  "/images/bulk-carrier-berth.jpg",
  "Bulk carrier at anchorage",
  "",
  "",
  "scheduled",
  "2026-12-01 09:00",
  "no",
  "What is grain clean?",
  "Holds that are clean, swept, washed with fresh water, dry and free of odour, insects and loose rust.",
  "How long does it take?",
  "It depends on the previous cargo.",
  "",
  "",
  "Britannia P&I hold cleaning guidance",
  "https://britanniapandi.com/wp-content/uploads/2025/05/Cargo-Hold-Cleaning-Standards-Guidance.pdf",
  "",
  "",
];

export function importTemplateCsv() {
  return toCsv([TEMPLATE_HEADER, TEMPLATE_EXAMPLE]);
}
