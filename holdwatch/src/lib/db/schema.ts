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
 * Hold Watch schema.
 *
 * Every table is prefixed `hw_` because this shares a Postgres instance with
 * the marketing API. Without the prefix a `drizzle-kit push` from either
 * project could drop the other's tables.
 *
 * THE ONE DESIGN DECISION WORTH KNOWING
 *
 * A compartment's completed stages are stored TWICE: as a denormalised array
 * on `hw_compartments.completed`, and as an append-only log in
 * `hw_stage_events`. That is deliberate, not an accident.
 *
 * The array is what every screen reads — one row per compartment, no joins,
 * fast enough to poll every few seconds on a dock 3G connection. The event log
 * is what answers "when exactly was Hold 3 finished, and who said so", which
 * is the question that actually matters when a client disputes a timeline. It
 * also survives the array being rewritten.
 *
 * The array is derived state. If the two ever disagree, the event log is the
 * truth — see `rebuildCompletedFromEvents` in ./repair.ts.
 */

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export const hwUserRole = pgEnum("hw_user_role", [
  "admin",
  "supervisor",
  "client",
]);

export const users = pgTable(
  "hw_users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: hwUserRole("role").notNull().default("supervisor"),
    /** Set for role "client" only — scopes every query to their company. */
    clientId: integer("client_id"),
    phone: varchar("phone", { length: 40 }),
    active: integer("active").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("hw_users_email_idx").on(t.email)],
);

/* ------------------------------------------------------------------ */
/* Clients (the companies whose vessels we clean)                      */
/* ------------------------------------------------------------------ */

export const clients = pgTable("hw_clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  contactName: varchar("contact_name", { length: 120 }),
  contactEmail: varchar("contact_email", { length: 160 }),
  contactPhone: varchar("contact_phone", { length: 40 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Jobs                                                                */
/* ------------------------------------------------------------------ */

export const hwJobType = pgEnum("hw_job_type", [
  "hold-cleaning",
  "tank-cleaning",
]);

export const hwJobStatus = pgEnum("hw_job_status", [
  "scheduled",
  "in-progress",
  "complete",
  "cancelled",
]);

export const jobs = pgTable(
  "hw_jobs",
  {
    id: serial("id").primaryKey(),
    /** Human reference used on the phone and in the report. e.g. HW-2608-01 */
    reference: varchar("reference", { length: 32 }).notNull(),
    vesselName: varchar("vessel_name", { length: 160 }).notNull(),
    /** IMO is 7 digits. Optional — barges and craft do not carry one. */
    imo: varchar("imo", { length: 16 }),
    port: varchar("port", { length: 160 }).notNull(),
    berth: varchar("berth", { length: 120 }),
    jobType: hwJobType("job_type").notNull().default("hold-cleaning"),
    status: hwJobStatus("status").notNull().default("scheduled"),
    clientId: integer("client_id").notNull(),
    supervisorId: integer("supervisor_id"),
    compartmentCount: integer("compartment_count").notNull().default(5),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    notes: text("notes"),
    /**
     * Unguessable token for the read-only share link (/j/{token}).
     *
     * This is a bearer credential in a URL: anyone holding it sees the job.
     * That is the intended trade-off — it is what lets a client check progress
     * without an account — but it means the token must be long and random, and
     * revocable. `shareRevoked` is the revoke.
     */
    shareToken: varchar("share_token", { length: 64 }).notNull(),
    shareRevoked: integer("share_revoked").notNull().default(0),
    /**
     * Bumped on every stage change. The polling endpoint compares this rather
     * than re-serialising the job, so an unchanged job costs one integer read.
     */
    version: integer("version").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("hw_jobs_reference_idx").on(t.reference),
    uniqueIndex("hw_jobs_share_token_idx").on(t.shareToken),
    index("hw_jobs_client_idx").on(t.clientId),
    index("hw_jobs_supervisor_idx").on(t.supervisorId),
  ],
);

/* ------------------------------------------------------------------ */
/* Compartments (holds or tanks)                                       */
/* ------------------------------------------------------------------ */

export const compartments = pgTable(
  "hw_compartments",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id").notNull(),
    /** 0-based position from the bow. Drives both label and diagram order. */
    position: integer("position").notNull(),
    /** "Hold 1", "Tank A" — denormalised so the label survives a type change. */
    label: varchar("label", { length: 40 }).notNull(),
    /**
     * Completed stage keys. Derived state — see the note at the top of this
     * file. Read by every screen; rebuilt from hw_stage_events if it drifts.
     */
    completed: jsonb("completed").$type<string[]>().notNull().default([]),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("hw_compartments_job_position_idx").on(t.jobId, t.position),
    index("hw_compartments_job_idx").on(t.jobId),
  ],
);

/* ------------------------------------------------------------------ */
/* Stage events — the append-only audit trail                          */
/* ------------------------------------------------------------------ */

export const hwStageAction = pgEnum("hw_stage_action", ["completed", "undone"]);

export const stageEvents = pgTable(
  "hw_stage_events",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id").notNull(),
    compartmentId: integer("compartment_id").notNull(),
    stageKey: varchar("stage_key", { length: 40 }).notNull(),
    action: hwStageAction("action").notNull(),
    userId: integer("user_id").notNull(),
    /** Denormalised so a deleted or renamed user does not erase the trail. */
    userName: varchar("user_name", { length: 120 }).notNull(),
    /**
     * When the supervisor actually tapped, which is not when the server heard
     * about it. A tap queued offline at the dock and synced an hour later must
     * report the dock time, or the trail is worse than useless.
     */
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Client-generated id, so a retried offline sync cannot double-apply. */
    idempotencyKey: varchar("idempotency_key", { length: 64 }),
  },
  (t) => [
    index("hw_stage_events_job_idx").on(t.jobId),
    index("hw_stage_events_compartment_idx").on(t.compartmentId),
    uniqueIndex("hw_stage_events_idem_idx").on(t.idempotencyKey),
  ],
);

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Compartment = typeof compartments.$inferSelect;
export type StageEvent = typeof stageEvents.$inferSelect;
