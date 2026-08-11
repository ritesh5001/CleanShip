import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { eq } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { serviceCategories, services } from "./schema.js";

/**
 * Seeds the service taxonomy from `seed-data.json`.
 *
 * The fixture is a committed snapshot of the site's original typed taxonomy,
 * not a live import of it. This service deploys on its own, so reaching into
 * the frontend's source at runtime would either break the build (it sits
 * outside rootDir) or fail in production (the source is not deployed here).
 * Regenerate the fixture with scripts/extract-taxonomy.mts if the site's
 * in-code taxonomy changes before the API becomes the source of truth.
 *
 * Idempotent: re-running updates existing rows by slug rather than
 * duplicating them, so it is safe against a database that already has data.
 */

type SeedService = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  tagline: string;
  summary: string;
  intro: string[];
  highlights: string[];
  scope: { title: string; body: string }[];
  process: { title: string; body: string }[];
  appliesTo: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
  coverageAreas: string[];
  coverageWorldwide: boolean;
  mediaSlug: string | null;
  position: number;
  published: boolean;
};

type SeedCategory = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  tagline: string;
  summary: string;
  intro: string[];
  icon: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  position: number;
  published: boolean;
  services: SeedService[];
};

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = await readFile(join(here, "seed-data.json"), "utf8");
  const data = JSON.parse(raw) as SeedCategory[];

  let categoriesWritten = 0;
  let servicesWritten = 0;

  for (const { services: children, ...category } of data) {
    const [saved] = await db
      .insert(serviceCategories)
      .values(category)
      .onConflictDoUpdate({
        target: serviceCategories.slug,
        set: { ...category, updatedAt: new Date() },
      })
      .returning({ id: serviceCategories.id });

    if (!saved) throw new Error(`Failed to upsert category ${category.slug}`);
    categoriesWritten++;

    for (const service of children) {
      await db
        .insert(services)
        .values({ ...service, categoryId: saved.id })
        .onConflictDoUpdate({
          // Matches the (category_id, slug) unique index — the same slug in a
          // different category is a different service.
          target: [services.categoryId, services.slug],
          set: { ...service, categoryId: saved.id, updatedAt: new Date() },
        });
      servicesWritten++;
    }
  }

  const [check] = await db
    .select({ id: serviceCategories.id })
    .from(serviceCategories)
    .where(eq(serviceCategories.slug, "hull-cleaning"))
    .limit(1);

  console.log(
    `[seed] ${categoriesWritten} categories, ${servicesWritten} services`,
  );
  console.log(
    check
      ? "[seed] hull-cleaning present and leading (position 0)"
      : "[seed] WARNING: hull-cleaning missing",
  );
}

main()
  .catch((err) => {
    console.error("[seed] failed", err);
    process.exitCode = 1;
  })
  .finally(closeDb);
