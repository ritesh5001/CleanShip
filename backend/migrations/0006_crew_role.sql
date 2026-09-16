-- The `crew` role.
--
-- Alone in its own migration on purpose. Postgres will not let a new enum
-- value be USED in the transaction that adds it, and the next migration
-- backfills and indexes against the same table. Splitting the two means the
-- value is committed before anything reads it, on every Postgres version,
-- rather than depending on the 12+ relaxation of that rule.
--
-- Crew sit BELOW supervisor: they sign into the Android app, see their own
-- joining paperwork and nothing else — no vessel, no status sheet, no other
-- person's record. A supervisor is still a crew member for the purposes of
-- joining a ship, which is why the role is additive rather than a split of
-- the existing one.

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'crew';
