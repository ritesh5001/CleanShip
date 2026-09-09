-- Roles become superadmin > admin > supervisor, and `editor` is retired.
--
-- Postgres cannot drop a value from an enum, so the type is rebuilt. Existing
-- editors are moved to `admin`.
--
-- That mapping is a PROMOTION and it is deliberate: an editor could work the
-- enquiry inbox and see no vessels at all, so there is nothing below admin
-- that leaves them able to sign in and do their job. Anyone who should not
-- have admin must be demoted or deactivated after this runs — the migration
-- prints how many accounts it moved so that is not left to chance.
--
-- Idempotent: guarded on the old type still containing 'editor', so a repeat
-- run is a no-op rather than an error.

DO $$
DECLARE
  moved integer := 0;
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'editor'
  ) THEN

    SELECT count(*) INTO moved FROM users WHERE role::text = 'editor';

    ALTER TYPE user_role RENAME TO user_role_old;
    CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'supervisor');

    ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE users
      ALTER COLUMN role TYPE user_role
      USING (
        CASE WHEN role::text = 'editor' THEN 'admin' ELSE role::text END
      )::user_role;
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'supervisor';

    DROP TYPE user_role_old;

    RAISE NOTICE 'user_role rebuilt; % editor account(s) promoted to admin — review them', moved;
  END IF;
END $$;

-- The first admin becomes the superadmin, so the tier is not left unoccupied.
-- Lowest id: the seeded account, which is the one that set the system up.
UPDATE users
SET role = 'superadmin'
WHERE id = (SELECT min(id) FROM users WHERE role = 'admin')
  AND NOT EXISTS (SELECT 1 FROM users WHERE role = 'superadmin');
