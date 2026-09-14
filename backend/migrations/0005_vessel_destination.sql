-- Where the vessel sails to after cleaning. Optional: often unknown when the
-- job is booked, and filled in later from the office.

ALTER TABLE vessels
  ADD COLUMN IF NOT EXISTS destination varchar(160);
