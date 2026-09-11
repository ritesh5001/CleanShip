-- Whether a gang is physically working a compartment right now.
--
-- Separate from cell status on purpose: a hold can sit at "in progress" for
-- hours between shifts with nobody in it, and a supervisor should be able to
-- say "crew is in Hold 3" without that being read off the stage grid, which
-- answers a different question.

ALTER TABLE compartments
  ADD COLUMN IF NOT EXISTS active integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_since timestamptz;
