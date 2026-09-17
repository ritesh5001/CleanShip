-- Who marked each joining item, and when.
--
-- A tick on the joining sheet looked the same whether the joiner ticked it
-- themselves or their supervisor or the office did. The point of crew filling
-- in their own sheet is that they can say "this is done from my side" — which
-- only means something if the office can see that it was the crew member who
-- said it.
--
-- Keyed "documents:passport", "checklist:rope_kit", "travel:boarded_flight".
-- Existing ticks have no mark: nobody recorded who made them, and inventing an
-- author for them would be worse than showing none.

ALTER TABLE crew_assignments
  ADD COLUMN IF NOT EXISTS marks jsonb NOT NULL DEFAULT '{}'::jsonb;
