import { Router } from "express";
import { z } from "zod";
import {
  SLUG_PATTERN,
  bulkImport,
  createPost,
  deletePost,
  getById,
  getPublishedBySlug,
  listAll,
  listPublished,
  updatePost,
} from "../domain/posts.js";
import { requireRole } from "../http/session.js";
import { parseBody, parseId } from "../http/validate.js";
import { ApiError } from "../http/errors.js";

export const postRoutes = Router();

/* -------------------------------------------------------------------- */
/* Public: the website reads these                                       */
/* -------------------------------------------------------------------- */

postRoutes.get("/", async (_req, res) => {
  res.json({ posts: await listPublished() });
});

postRoutes.get("/slug/:slug", async (req, res) => {
  const post = await getPublishedBySlug(String(req.params.slug));
  if (!post) throw ApiError.notFound("No such post.");
  res.json({ post });
});

/* -------------------------------------------------------------------- */
/* Admin: the editor                                                     */
/* -------------------------------------------------------------------- */

const url = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || /^(https?:\/\/|\/)/.test(v), "Use a full https:// link or a site path starting with /.");

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "The URL slug needs at least 3 characters.")
    .max(160)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens only."),
  title: z.string().trim().min(3, "Give the post a title.").max(200),
  seoTitle: z.string().trim().max(80).nullish(),
  description: z.string().trim().max(320).optional(),
  category: z.string().trim().max(80).optional(),
  keywords: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
  lead: z.string().max(4000).optional(),
  body: z.string().max(200_000).optional(),
  faqs: z
    .array(z.object({ q: z.string().trim().min(1).max(300), a: z.string().trim().min(1).max(3000) }))
    .max(30)
    .optional(),
  sources: z
    .array(z.object({ label: z.string().trim().min(1).max(300), url }))
    .max(40)
    .optional(),
  coverImageUrl: url.nullish(),
  coverImageAlt: z.string().trim().max(200).nullish(),
  authorName: z.string().trim().max(120).optional(),
  authorRole: z.string().trim().max(160).nullish(),
  status: z.enum(["draft", "published"]).optional(),
  noindex: z.boolean().optional(),
  publishedAt: z.coerce.date().nullish(),
});

postRoutes.get("/admin", requireRole("admin"), async (_req, res) => {
  res.json({ posts: await listAll() });
});

/* CSV import. The site parses the file and sends the rows; each row is
   checked against the same schema as the editor, and every problem in the
   file is reported at once rather than one per attempt. */
const bulkSchema = z.object({
  posts: z.array(z.unknown()).min(1, "The file has no posts in it.").max(200, "Import at most 200 posts at a time."),
  onExisting: z.enum(["skip", "update"]).default("skip"),
  dryRun: z.boolean().default(false),
});

postRoutes.post("/admin/bulk", requireRole("admin"), async (req, res) => {
  const { posts, onExisting, dryRun } = parseBody(bulkSchema, req.body);
  const rows = posts.map((raw, i) => {
    const parsed = schema.safeParse(raw);
    const loose = (raw ?? {}) as { slug?: unknown; title?: unknown };
    return {
      row: i + 1,
      input: parsed.success ? parsed.data : null,
      errors: parsed.success
        ? []
        : parsed.error.issues.map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`),
      slug: parsed.success ? parsed.data.slug : typeof loose.slug === "string" ? loose.slug : "",
      title: parsed.success ? parsed.data.title : typeof loose.title === "string" ? loose.title : "",
    };
  });
  res.json(await bulkImport(rows, { onExisting, dryRun }));
});

postRoutes.get("/admin/:id", requireRole("admin"), async (req, res) => {
  res.json({ post: await getById(parseId(req.params.id, "post id")) });
});

postRoutes.post("/admin", requireRole("admin"), async (req, res) => {
  const body = parseBody(schema, req.body);
  res.status(201).json({ post: await createPost(body) });
});

postRoutes.patch("/admin/:id", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "post id");
  const body = parseBody(schema.partial(), req.body);
  res.json({ post: await updatePost(id, body) });
});

postRoutes.delete("/admin/:id", requireRole("admin"), async (req, res) => {
  await deletePost(parseId(req.params.id, "post id"));
  res.status(204).end();
});
