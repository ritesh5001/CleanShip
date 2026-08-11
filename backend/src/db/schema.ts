import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Database schema.
 *
 * Content tables mirror the shape the frontend already renders (see the
 * frontend's src/lib/services.ts) so the site can be pointed at this API
 * without reshaping its components. Rich sub-structures — scope steps,
 * process steps, FAQs — are stored as JSONB rather than child tables: they
 * are always read as a whole block with their parent, are never queried
 * across rows, and are edited as a unit in the admin UI. Normalising them
 * would buy joins nobody needs.
 */

/* ------------------------------------------------------------------ */
/* Admin users                                                         */
/* ------------------------------------------------------------------ */

export const userRole = pgEnum("user_role", ["admin", "editor"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    /** bcrypt hash. The plaintext password never leaves the request handler. */
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: userRole("role").notNull().default("editor"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

/* ------------------------------------------------------------------ */
/* Enquiries                                                           */
/* ------------------------------------------------------------------ */

export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "in_progress",
  "quoted",
  "won",
  "lost",
  "spam",
]);

export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 60 }),
    company: varchar("company", { length: 160 }),
    vessel: varchar("vessel", { length: 120 }),
    /** Free text — which service the enquiry came from. */
    service: varchar("service", { length: 160 }),
    message: text("message").notNull(),

    status: enquiryStatus("status").notNull().default("new"),
    /** Internal notes, not visible to the enquirer. */
    notes: text("notes"),

    /** Which page the form was submitted from. */
    sourcePath: varchar("source_path", { length: 255 }),
    /** Truncated; kept for abuse triage, not analytics. */
    userAgent: varchar("user_agent", { length: 255 }),
    ipHash: varchar("ip_hash", { length: 64 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // The admin inbox lists newest-first, filtered by status.
    index("enquiries_created_at_idx").on(t.createdAt),
    index("enquiries_status_idx").on(t.status),
  ],
);

/* ------------------------------------------------------------------ */
/* Service content                                                     */
/* ------------------------------------------------------------------ */

export const serviceCategories = pgTable(
  "service_categories",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    seoTitle: varchar("seo_title", { length: 200 }).notNull(),
    metaDescription: text("meta_description").notNull(),
    tagline: varchar("tagline", { length: 200 }).notNull(),
    summary: text("summary").notNull(),
    /** Paragraphs. */
    intro: jsonb("intro").$type<string[]>().notNull().default([]),
    icon: varchar("icon", { length: 40 }).notNull(),
    keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<{ q: string; a: string }[]>().notNull().default([]),
    /** Drives display order everywhere; hull cleaning currently leads. */
    position: integer("position").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("service_categories_slug_unique").on(t.slug),
    index("service_categories_position_idx").on(t.position),
  ],
);

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      // Deleting a category takes its services with it — an orphaned service
      // has no reachable URL, since routes are /services/[category]/[service].
      .references(() => serviceCategories.id, { onDelete: "cascade" }),

    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    seoTitle: varchar("seo_title", { length: 200 }).notNull(),
    metaDescription: text("meta_description").notNull(),
    tagline: varchar("tagline", { length: 200 }).notNull(),
    summary: text("summary").notNull(),

    intro: jsonb("intro").$type<string[]>().notNull().default([]),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    scope: jsonb("scope")
      .$type<{ title: string; body: string }[]>()
      .notNull()
      .default([]),
    process: jsonb("process")
      .$type<{ title: string; body: string }[]>()
      .notNull()
      .default([]),
    appliesTo: jsonb("applies_to").$type<string[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<{ q: string; a: string }[]>().notNull().default([]),
    keywords: jsonb("keywords").$type<string[]>().notNull().default([]),

    /** Where this scope operates; empty + worldwide=true means anywhere. */
    coverageAreas: jsonb("coverage_areas").$type<string[]>().notNull().default([]),
    coverageWorldwide: boolean("coverage_worldwide").notNull().default(false),

    /** Basename of the hero clip in the frontend's public/videos. */
    mediaSlug: varchar("media_slug", { length: 120 }),

    position: integer("position").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // Slugs are only unique within a category, matching the URL shape.
    uniqueIndex("services_category_slug_unique").on(t.categoryId, t.slug),
    index("services_position_idx").on(t.position),
  ],
);

/* ------------------------------------------------------------------ */
/* Projects / case studies                                             */
/* ------------------------------------------------------------------ */

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    vesselType: varchar("vessel_type", { length: 160 }).notNull(),
    scopeLabel: varchar("scope_label", { length: 160 }).notNull(),

    /** Optional link back into the service taxonomy. */
    categorySlug: varchar("category_slug", { length: 120 }),
    serviceSlug: varchar("service_slug", { length: 120 }),

    challenge: text("challenge").notNull(),
    approach: text("approach").notNull(),
    outcome: text("outcome").notNull(),

    /**
     * False until the client has cleared the write-up for publication. The
     * frontend currently ships illustrative placeholders behind a visible
     * notice; nothing should go live as a real case study without this.
     */
    published: boolean("published").notNull().default(false),
    position: integer("position").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("projects_slug_unique").on(t.slug),
    index("projects_position_idx").on(t.position),
  ],
);

export type User = typeof users.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
