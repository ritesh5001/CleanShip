-- Vessel references come from a counter, not a count.
--
-- CT-YYMM-NN used to be "how many vessels this month, plus one". That held
-- only while vessels were never deleted. Once they could be, deleting any
-- vessel dropped the count below the highest number already issued, and the
-- next vessel was given a reference that still existed — CT-2609-06 while
-- CT-2609-06 was on the books. Every retry recomputed the same number, so
-- creating a vessel failed outright until another one was deleted.
--
-- A counter per month only ever moves forward. A deleted vessel's number is
-- never handed to a different ship, which matters because references are what
-- people quote over the radio and write on paper: two ships that have both
-- been CT-2609-06 is an argument waiting to happen.

CREATE TABLE IF NOT EXISTS reference_counters (
  stem varchar(16) PRIMARY KEY,   -- "CT-2609"
  last integer NOT NULL
);

-- Seed from what exists, so the first number issued after this deploy is
-- above every reference already in use.
INSERT INTO reference_counters (stem, last)
SELECT substring(reference from '^(CT-[0-9]{4})-'),
       max(substring(reference from '-([0-9]+)$')::int)
FROM vessels
WHERE reference ~ '^CT-[0-9]{4}-[0-9]+$'
GROUP BY 1
ON CONFLICT (stem) DO UPDATE
  SET last = GREATEST(reference_counters.last, EXCLUDED.last);
