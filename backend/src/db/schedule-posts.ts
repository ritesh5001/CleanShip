import "../load-env.js";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { posts, type PostFaq, type PostSource } from "./schema.js";
import { SLUG_PATTERN, type PostInput } from "../domain/posts.js";

/**
 * Loads the scheduled blog posts in backend/content/blog/ into the database.
 *
 *   npm run schedule-posts                 dry run — lists the schedule
 *   npm run schedule-posts -- --apply      inserts posts whose slug is new
 *   npm run schedule-posts -- --apply --update
 *                                          also rewrites posts already loaded
 *
 * Each post is saved as "published" with `publishedAt` set to 09:00 IST on its
 * `publishOn` date. The public API hides a post until that moment, so nothing
 * else has to run on the day. That only holds once the API that filters on
 * the date is deployed — load posts before that and they all go live at once.
 *
 * File format: a `key: value` header between `---` lines, then Markdown.
 * Text before the first `##` is the lead. `## Frequently asked questions`
 * holds `### question` / answer pairs and `## Sources` a list of
 * `[label](url)` links; both are lifted out of the body into their own fields.
 */

const here = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = resolve(here, "../../content/blog");

/** 09:00 in India is 03:30 UTC. */
const PUBLISH_TIME_UTC = "T03:30:00Z";

type Parsed = PostInput & { file: string };

function parseHeader(block: string, file: string) {
  const header: Record<string, string> = {};
  for (const line of block.split("\n")) {
    if (!line.trim()) continue;
    const m = /^([A-Za-z]+):\s*(.*)$/.exec(line);
    if (!m) throw new Error(`${file}: bad header line "${line}"`);
    header[m[1]] = m[2].trim();
  }
  for (const key of ["slug", "title", "description", "category", "publishOn"]) {
    if (!header[key]) throw new Error(`${file}: header is missing "${key}"`);
  }
  return header;
}

/** Splits the Markdown at its `## ` headings, ignoring fenced code. */
function sections(markdown: string) {
  const out: { heading: string | null; text: string }[] = [{ heading: null, text: "" }];
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const m = !fenced && /^##\s+(.+?)\s*$/.exec(line);
    if (m) out.push({ heading: m[1], text: "" });
    else out[out.length - 1].text += line + "\n";
  }
  return out;
}

function parseFaqs(text: string, file: string): PostFaq[] {
  const faqs: PostFaq[] = [];
  for (const chunk of text.split(/^###\s+/m).slice(1)) {
    const [q, ...rest] = chunk.split("\n");
    const a = rest.join("\n").trim().replace(/\s*\n\s*/g, " ");
    if (!q.trim() || !a) throw new Error(`${file}: empty FAQ "${q}"`);
    faqs.push({ q: q.trim(), a });
  }
  return faqs;
}

function parseSources(text: string, file: string): PostSource[] {
  return text
    .split("\n")
    .filter((l) => l.trim().startsWith("-"))
    .map((l) => {
      const m = /\[([^\]]+)\]\(([^)]+)\)/.exec(l);
      if (!m) throw new Error(`${file}: bad source line "${l}"`);
      return { label: m[1].trim(), url: m[2].trim() };
    });
}

function parseFile(file: string): Parsed {
  const raw = readFileSync(join(CONTENT_DIR, file), "utf8").replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`${file}: no --- header`);
  const h = parseHeader(m[1], file);
  if (!SLUG_PATTERN.test(h.slug)) throw new Error(`${file}: bad slug "${h.slug}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(h.publishOn)) throw new Error(`${file}: publishOn must be YYYY-MM-DD`);

  const parts = sections(m[2]);
  const lead = parts[0].text.trim();
  let faqs: PostFaq[] = [];
  let sources: PostSource[] = [];
  const body: string[] = [];
  for (const part of parts.slice(1)) {
    if (/^frequently asked questions$/i.test(part.heading!)) faqs = parseFaqs(part.text, file);
    else if (/^sources$/i.test(part.heading!)) sources = parseSources(part.text, file);
    else body.push(`## ${part.heading}\n${part.text}`);
  }
  if (!lead) throw new Error(`${file}: no lead paragraph before the first ##`);

  const publishedAt = new Date(`${h.publishOn}${PUBLISH_TIME_UTC}`);

  return {
    file,
    slug: h.slug,
    title: h.title,
    seoTitle: h.seoTitle || null,
    description: h.description,
    category: h.category,
    keywords: (h.keywords ?? "").split(",").map((k) => k.trim()).filter(Boolean),
    lead,
    body: body.join("\n").trim(),
    faqs,
    sources,
    coverImageUrl: h.cover || null,
    coverImageAlt: h.coverAlt || null,
    authorName: "",
    status: "published",
    publishedAt,
  };
}

function checkLimits(p: Parsed) {
  const problems: string[] = [];
  if (p.title.length > 200) problems.push("title over 200");
  if ((p.seoTitle ?? "").length > 80) problems.push("seoTitle over 80");
  if ((p.description ?? "").length > 320) problems.push("description over 320");
  if ((p.keywords ?? []).length > 30) problems.push("over 30 keywords");
  if ((p.lead ?? "").length > 4000) problems.push("lead over 4000");
  if ((p.faqs ?? []).some((f) => f.q.length > 300 || f.a.length > 3000)) problems.push("FAQ too long");
  if (problems.length) throw new Error(`${p.file}: ${problems.join(", ")}`);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const update = process.argv.includes("--update");

  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort();
  const parsed = files.map(parseFile);
  parsed.forEach(checkLimits);

  /* Posts sharing a morning are spaced a second apart, earlier file later, so
     the newest-first blog index shows them in file order. */
  const byDay = new Map<number, Parsed[]>();
  for (const p of parsed) byDay.set(p.publishedAt!.getTime(), [...(byDay.get(p.publishedAt!.getTime()) ?? []), p]);
  for (const day of byDay.values()) day.forEach((p, i) => p.publishedAt!.setUTCSeconds(day.length - 1 - i));

  const slugs = new Set<string>();
  for (const p of parsed) {
    if (slugs.has(p.slug)) throw new Error(`${p.file}: duplicate slug "${p.slug}"`);
    slugs.add(p.slug);
  }

  let inserted = 0;
  let updated = 0;
  for (const p of parsed) {
    const words = `${p.lead} ${p.body}`.split(/\s+/).filter(Boolean).length;
    const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, p.slug)).limit(1);
    const action = existing ? (update ? "update" : "skip  ") : "insert";
    console.log(
      `${action}  ${p.publishedAt!.toISOString()}  ${String(words).padStart(5)}w  ${p.faqs!.length}faq  ${p.slug}`,
    );
    if (!apply) continue;

    const { file: _file, ...values } = p;
    if (!existing) {
      await db.insert(posts).values(values);
      inserted++;
    } else if (update) {
      await db.update(posts).set({ ...values, updatedAt: new Date() }).where(eq(posts.id, existing.id));
      updated++;
    }
  }

  console.log(`\n${parsed.length} posts in ${CONTENT_DIR}`);
  if (!apply) console.log("Dry run. Re-run with --apply to load them.");
  else console.log(`Inserted ${inserted}, updated ${updated}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
