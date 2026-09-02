import {
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
 * The database. All of it.
 *
 * This file replaces two schemas that used to live in separate services — the
 * Express API's and CleanTrack's. They are merged because they were always one
 * database, and keeping two definitions of it meant two migration histories
 * racing to modify the same instance.
 *
 * WHAT WAS DROPPED IN THE MERGE, AND WHY
 *
 * The old API carried `service_categories`, `services` and `projects` tables
 * with full CRUD behind an admin UI. Nothing read them: the marketing site
 * renders from the typed taxonomy in src/lib/services.ts, which is what makes
 * 800+ pages statically prerenderable. Porting a CMS for content no page reads
 * would have been real work with no reader. If a content CMS is wanted later,
 * it should be designed against how the site actually renders.
 *
 * `enquiries` was kept — the inbox is genuinely used.
 */

/* ------------------------------------------------------------------ */
/* Users — ONE table for everyone                                      */
/* ------------------------------------------------------------------ */

/**
 * Roles. All three are staff — there is no customer login.
 *
 *   admin       everything: the enquiry inbox and CleanTrack
 *   editor      the enquiry inbox only
 *   supervisor  CleanTrack — updates the jobs they are assigned to
 *
 * Customers deliberately have NO account. They watch a job through a share
 * link plus the vessel's IMO number, which means nothing to issue, nothing to
 * reset, and nobody chasing the office for a password at 02:00 because a
 * vessel sailed. See src/app/cleantrack/j/[token].
 */
export const userRole = pgEnum("user_role", ["admin", "editor", "supervisor"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    /** bcrypt hash. The plaintext never leaves the action that received it. */
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: userRole("role").notNull().default("editor"),
    phone: varchar("phone", { length: 40 }),
    active: integer("active").notNull().default(1),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

/* ------------------------------------------------------------------ */
/* Enquiries — the website contact forms                               */
/* ------------------------------------------------------------------ */

export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "in-progress",
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
    phone: varchar("phone", { length: 40 }),
    company: varchar("company", { length: 160 }),
    vessel: varchar("vessel", { length: 120 }),
    /** Which page the enquiry came from — the service or port name. */
    service: varchar("service", { length: 200 }),
    message: text("message").notNull(),
    status: enquiryStatus("status").notNull().default("new"),
    /** Salted one-way digest, for abuse triage without storing the address. */
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("enquiries_status_idx").on(t.status)],
);

/* ------------------------------------------------------------------ */
/* CleanTrack                                                          */
/*                                                                     */
/* Prefixed `ct_` so the job-tracking tables are obvious at a glance in  */
/* a database that also holds the website's users and enquiries.        */
/* ------------------------------------------------------------------ */

export const ctClients = pgTable("ct_clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  contactName: varchar("contact_name", { length: 120 }),
  contactEmail: varchar("contact_email", { length: 160 }),
  contactPhone: varchar("contact_phone", { length: 40 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ctJobType = pgEnum("ct_job_type", [
  "hold-cleaning",
  "tank-cleaning",
]);

export const ctJobStatus = pgEnum("ct_job_status", [
  "scheduled",
  "in-progress",
  "complete",
  "cancelled",
]);

export const ctJobs = pgTable(
  "ct_jobs",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 32 }).notNull(),
    vesselName: varchar("vessel_name", { length: 160 }).notNull(),
    imo: varchar("imo", { length: 16 }),
    port: varchar("port", { length: 160 }).notNull(),
    berth: varchar("berth", { length: 120 }),
    jobType: ctJobType("job_type").notNull().default("hold-cleaning"),
    status: ctJobStatus("status").notNull().default("scheduled"),
    clientId: integer("client_id").notNull(),
    supervisorId: integer("supervisor_id"),
    compartmentCount: integer("compartment_count").notNull().default(5),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    notes: text("notes"),
    /**
     * Unguessable token for the read-only share link.
     *
     * A bearer credential in a URL: anyone holding it sees the job. That is the
     * intended trade-off — it is what lets a client watch progress without an
     * account — which is why it is long, random, and revocable.
     */
    shareToken: varchar("share_token", { length: 64 }).notNull(),
    shareRevoked: integer("share_revoked").notNull().default(0),
    /** Bumped on every stage change; the poll endpoint compares this. */
    version: integer("version").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("ct_jobs_reference_idx").on(t.reference),
    uniqueIndex("ct_jobs_share_token_idx").on(t.shareToken),
    index("ct_jobs_client_idx").on(t.clientId),
    index("ct_jobs_supervisor_idx").on(t.supervisorId),
  ],
);

/**
 * A compartment's completed stages are stored TWICE: as an array here, and as
 * an append-only log in ct_stage_events.
 *
 * The array is what every screen reads — one row per compartment, no joins,
 * cheap enough to poll on a dock connection. The log answers "when exactly was
 * Hold 3 finished, and who said so", which is the question that matters when a
 * client disputes a timeline.
 *
 * The array is derived state. If the two disagree, the log is the truth.
 */
export const ctCompartments = pgTable(
  "ct_compartments",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id").notNull(),
    position: integer("position").notNull(),
    label: varchar("label", { length: 40 }).notNull(),
    completed: jsonb("completed").$type<string[]>().notNull().default([]),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("ct_compartments_job_position_idx").on(t.jobId, t.position),
    index("ct_compartments_job_idx").on(t.jobId),
  ],
);

export const ctStageAction = pgEnum("ct_stage_action", ["completed", "undone"]);

export const ctStageEvents = pgTable(
  "ct_stage_events",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id").notNull(),
    compartmentId: integer("compartment_id").notNull(),
    stageKey: varchar("stage_key", { length: 40 }).notNull(),
    action: ctStageAction("action").notNull(),
    userId: integer("user_id").notNull(),
    /** Denormalised so a deleted or renamed user cannot erase the trail. */
    userName: varchar("user_name", { length: 120 }).notNull(),
    /**
     * When the supervisor tapped, which is not when the server heard about it.
     * A tap queued offline at a dock and synced an hour later must report the
     * dock time, or the trail is worse than useless.
     */
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Client-generated, so a retried offline sync cannot double-apply. */
    idempotencyKey: varchar("idempotency_key", { length: 64 }),
  },
  (t) => [
    index("ct_stage_events_job_idx").on(t.jobId),
    index("ct_stage_events_compartment_idx").on(t.compartmentId),
    uniqueIndex("ct_stage_events_idem_idx").on(t.idempotencyKey),
  ],
);

export type User = typeof users.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type CtClient = typeof ctClients.$inferSelect;
export type CtJob = typeof ctJobs.$inferSelect;
export type CtCompartment = typeof ctCompartments.$inferSelect;
export type CtStageEvent = typeof ctStageEvents.$inferSelect;
