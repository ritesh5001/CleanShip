-- Start and finish times per cell.
--
-- The audit trail already records WHEN A TAP HAPPENED, which answers "when was
-- this recorded". It does not answer "when did the crew start HP washing hold
-- 3, and when did they finish" — the question a client asks when they are
-- being invoiced for time, and the one the paper sheet answered with two
-- handwritten columns.
--
-- Nullable on purpose. A stage marked done without ever passing through
-- in-progress has no honest start time, and inventing one (by backfilling from
-- the completion) would put a fabricated number in front of a customer.

ALTER TABLE cells ADD COLUMN IF NOT EXISTS started_at   timestamptz;
ALTER TABLE cells ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Reading a vessel's timeline means scanning its cells by time.
CREATE INDEX IF NOT EXISTS cells_started_idx ON cells (vessel_id, started_at);
