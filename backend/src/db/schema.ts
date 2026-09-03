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
import type { Stage } from "../domain/stages.js";

/**
 * The database, in one file.
 *
 * Shape of the system, in one paragraph: an ADMIN creates a VESSEL, saying how
 * many holds or tanks it has and which STAGES the crew works through. That
 * creates one COMPARTMENT per hold/tank and one CELL per compartment × stage —
 * exactly the grid on the paper status sheet this replaces. The admin assigns a
 * SUPERVISOR, who then moves cells between pending, in progress, done and not
 * applicable. Every move is also appended to CELL_EVENTS, which is the record
 * that settles a dispute about when Hold 3 was finished.
 */

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

/**
 * Roles. All three are staff — there is no customer login.
 *
 *   admin       everything: vessels, users, clients, the enquiry inbox
 *   editor      the enquiry inbox only
 *   supervisor  the vessels they are assigned to, and nothing else
 *
 * Customers deliberately have no account. They watch a vessel through a share
 * link plus its IMO number: nothing to issue, nothing to reset, and nobody
 * chasing the office for a password at 02:00 because a vessel sailed.
 */
export const userRole = pgEnum("user_role", ["admin", "editor", "supervisor"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    /** bcrypt hash. The plaintext never leaves the request that carried it. */
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: userRole("role").notNull().default("supervisor"),
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
/* Clients — whose vessel it is                                        */
/* ------------------------------------------------------------------ */

export const clients = pgTable("clients", {
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
/* Vessels                                                             */
/* ------------------------------------------------------------------ */

export const vesselType = pgEnum("vessel_type", ["hold", "tank"]);

export const vesselStatus = pgEnum("vessel_status", [
  "scheduled",
  "in-progress",
  "complete",
  "cancelled",
]);

export const vessels = pgTable(
  "vessels",
  {
    id: serial("id").primaryKey(),
    /** CT-YYMM-NN. Readable over a bad phone line from a jetty. */
    reference: varchar("reference", { length: 32 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    imo: varchar("imo", { length: 16 }),
    port: varchar("port", { length: 160 }).notNull(),
    berth: varchar("berth", { length: 120 }),
    type: vesselType("type").notNull().default("hold"),
    status: vesselStatus("status").notNull().default("scheduled"),
    clientId: integer("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    supervisorId: integer("supervisor_id").references(() => users.id, {
      onDelete: "set null",
    }),

    /**
     * The stage list for THIS vessel, in order, copied from a template at
     * creation and editable per vessel.
     *
     * Stored on the row rather than referenced from a shared table on purpose:
     * a vessel's checklist is a record of what was actually agreed and worked,
     * and editing the "hold cleaning" template six months later must not
     * silently rewrite what a completed job says it did.
     */
    stages: jsonb("stages").$type<Stage[]>().notNull().default([]),

    compartmentCount: integer("compartment_count").notNull().default(0),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),

    /**
     * Unguessable token for the read-only customer link.
     *
     * A bearer credential in a URL: anyone holding it reaches the IMO gate.
     * That is the intended trade-off — it is what lets a client watch progress
     * without an account — which is why it is long, random and revocable.
     */
    shareToken: varchar("share_token", { length: 64 }).notNull(),
    shareRevoked: integer("share_revoked").notNull().default(0),

    /** Bumped on every cell change. The live-progress poll compares this. */
    version: integer("version").notNull().default(0),

    createdById: integer("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("vessels_reference_idx").on(t.reference),
    uniqueIndex("vessels_share_token_idx").on(t.shareToken),
    index("vessels_supervisor_idx").on(t.supervisorId),
    index("vessels_client_idx").on(t.clientId),
    index("vessels_status_idx").on(t.status),
  ],
);

/* ------------------------------------------------------------------ */
/* Compartments — one row per hold or tank                             */
/* ------------------------------------------------------------------ */

export const compartments = pgTable(
  "compartments",
  {
    id: serial("id").primaryKey(),
    vesselId: integer("vessel_id")
      .notNull()
      .references(() => vessels.id, { onDelete: "cascade" }),
    /** Display order. Zero-based, dense. */
    position: integer("position").notNull(),
    /** "Hold No. 1", "3p", "Sl S" — whatever the vessel's own plan calls it. */
    label: varchar("label", { length: 40 }).notNull(),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("compartments_vessel_position_idx").on(t.vesselId, t.position),
    index("compartments_vessel_idx").on(t.vesselId),
  ],
);

/* ------------------------------------------------------------------ */
/* Cells — one row per compartment × stage                             */
/* ------------------------------------------------------------------ */

/**
 * The four states a cell can hold, matching the paper sheet exactly:
 *
 *   pending      blank      not started
 *   in_progress  yellow     being worked now
 *   done         green      finished
 *   na           blocked    does not apply to this compartment
 *
 * `na` is not cosmetic. A tank that is not part of the scope must be excluded
 * from the denominator, or a vessel can never reach 100% and the crew learns
 * to ignore the number.
 */
export const cellStatus = pgEnum("cell_status", [
  "pending",
  "in_progress",
  "done",
  "na",
]);

export const cells = pgTable(
  "cells",
  {
    id: serial("id").primaryKey(),
    vesselId: integer("vessel_id")
      .notNull()
      .references(() => vessels.id, { onDelete: "cascade" }),
    compartmentId: integer("compartment_id")
      .notNull()
      .references(() => compartments.id, { onDelete: "cascade" }),
    /** Matches a `key` in vessels.stages. Never renamed once written. */
    stageKey: varchar("stage_key", { length: 40 }).notNull(),
    status: cellStatus("status").notNull().default("pending"),
    /** Free text the crew adds — "Water in tank", "awaiting surveyor". */
    note: varchar("note", { length: 160 }),
    updatedById: integer("updated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    updatedByName: varchar("updated_by_name", { length: 120 }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("cells_compartment_stage_idx").on(t.compartmentId, t.stageKey),
    index("cells_vessel_idx").on(t.vesselId),
  ],
);

/* ------------------------------------------------------------------ */
/* Audit trail                                                         */
/* ------------------------------------------------------------------ */

/**
 * Append-only. `cells` is the current picture; this is how it got there.
 *
 * Nothing derives from this table at read time, which is exactly why it is
 * trustworthy: it is never recomputed, only added to.
 */
export const cellEvents = pgTable(
  "cell_events",
  {
    id: serial("id").primaryKey(),
    vesselId: integer("vessel_id")
      .notNull()
      .references(() => vessels.id, { onDelete: "cascade" }),
    compartmentId: integer("compartment_id").notNull(),
    /** Denormalised so renaming a compartment cannot rewrite the trail. */
    compartmentLabel: varchar("compartment_label", { length: 40 }).notNull(),
    stageKey: varchar("stage_key", { length: 40 }).notNull(),
    stageLabel: varchar("stage_label", { length: 80 }).notNull(),
    fromStatus: cellStatus("from_status").notNull(),
    toStatus: cellStatus("to_status").notNull(),
    note: varchar("note", { length: 160 }),
    userId: integer("user_id"),
    /** Denormalised so a deleted or renamed user cannot erase the trail. */
    userName: varchar("user_name", { length: 120 }).notNull(),
    /**
     * When the supervisor tapped — not when the server heard about it. A tap
     * queued at a berth with no signal and synced an hour later must report
     * the berth time, or the trail is worse than useless.
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
    index("cell_events_vessel_idx").on(t.vesselId),
    index("cell_events_compartment_idx").on(t.compartmentId),
    uniqueIndex("cell_events_idem_idx").on(t.idempotencyKey),
  ],
);

/* ------------------------------------------------------------------ */
/* Enquiries — the marketing site's contact forms                      */
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
    /** Which page it came from — the service or port name. */
    service: varchar("service", { length: 200 }),
    message: text("message").notNull(),
    status: enquiryStatus("status").notNull().default("new"),
    /** Salted one-way digest: abuse triage without storing the address. */
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("enquiries_status_idx").on(t.status)],
);

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Vessel = typeof vessels.$inferSelect;
export type Compartment = typeof compartments.$inferSelect;
export type Cell = typeof cells.$inferSelect;
export type CellEvent = typeof cellEvents.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
