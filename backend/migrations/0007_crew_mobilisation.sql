-- Crew mobilisation: getting people onto the ship, before any hold is cleaned.
--
-- This replaces a printed sheet with a column per joiner and a row per item —
-- passport, CDC, IRATA, BOSIET, medical, yellow fever, SID, insurance down the
-- top half, then contract, nominee details, rope kit, boiler suit and the rest
-- below it, with travel milestones pencilled in the margin.
--
-- HOW IT FITS THE EXISTING SHAPE
--
-- A vessel already carries its own `stages`, copied from a template at
-- creation and frozen thereafter so that editing the template later cannot
-- rewrite what a finished job says it did. The two new lists follow that rule
-- exactly, for the same reason: what a vessel asked its joiners for is part of
-- the record of that job.
--
-- `hold_reported_at` is the switch. Until it is set the crew are travelling
-- and the app shows joining paperwork; once it is set they are aboard, the
-- cleaning has started and the paperwork retires.

/* ------------------------------------------------------------------ */
/* Vessel: the two lists, and the switch                               */
/* ------------------------------------------------------------------ */

ALTER TABLE vessels
  ADD COLUMN IF NOT EXISTS crew_documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS crew_checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hold_reported_at timestamptz,
  ADD COLUMN IF NOT EXISTS hold_reported_by_id integer
    REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hold_reported_by_name varchar(120);

/* ------------------------------------------------------------------ */
/* One row per person on one vessel                                    */
/* ------------------------------------------------------------------ */

-- The three jsonb maps are keyed by the item keys held on the vessel's own
-- lists, so a row is read and written as one document — which is exactly how
-- both the app and the admin board use it. They are maps rather than rows
-- because nothing queries across them: the only question ever asked is "what
-- is outstanding for this person on this vessel".
--
-- Writes MERGE keys rather than replacing the map, so a supervisor ticking
-- the rope kit at the same moment the joiner fills in their nominee details
-- cannot erase the other's work.
CREATE TABLE IF NOT EXISTS crew_assignments (
  id              serial PRIMARY KEY,
  vessel_id       integer NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  user_id         integer NOT NULL REFERENCES users(id)   ON DELETE CASCADE,

  -- { "passport": "done" | "pending" | "expired", ... }
  documents       jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- { "rope_kit": true, ... }
  checklist       jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- { "boarded_flight": "2026-09-16T04:20:00.000Z", ... } — when it happened,
  -- as wall-clock time with no zone, the same convention the cleaning times use.
  travel          jsonb NOT NULL DEFAULT '{}'::jsonb,

  notes           text,
  updated_by_id   integer REFERENCES users(id) ON DELETE SET NULL,
  updated_by_name varchar(120),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- One row per person per vessel. The app relies on this: re-adding somebody
-- already on the roster must reach their existing paperwork, never start a
-- second blank copy of it.
CREATE UNIQUE INDEX IF NOT EXISTS crew_assignments_vessel_user_idx
  ON crew_assignments (vessel_id, user_id);

-- "Which vessels am I joining?" — the crew app's only query.
CREATE INDEX IF NOT EXISTS crew_assignments_user_idx
  ON crew_assignments (user_id);

/* ------------------------------------------------------------------ */
/* Backfill                                                            */
/* ------------------------------------------------------------------ */

-- Every vessel that already exists predates this feature, so nobody has filled
-- in any joining paperwork for it and nobody can. Marking them all as reported
-- means today's live jobs open on the cleaning sheet exactly as they do now:
-- this migration changes nothing anyone is currently looking at, and the
-- mobilisation phase starts with the next vessel created.
--
-- `created_at` rather than now() for a scheduled vessel, so the timestamp does
-- not claim a crew reported aboard at the moment of a deploy.
UPDATE vessels
SET hold_reported_at = COALESCE(started_at, created_at)
WHERE hold_reported_at IS NULL;
