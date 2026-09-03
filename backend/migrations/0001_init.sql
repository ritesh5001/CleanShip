-- CleanTrack, initial schema.
--
-- Written by hand rather than generated so it can be read in review: it is the
-- one artefact in this repo that runs against production data.
--
-- Everything is IF NOT EXISTS / guarded, because the runner records what it
-- applied but a half-applied migration from a failed deploy must be safe to
-- re-run.

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'editor', 'supervisor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vessel_type AS ENUM ('hold', 'tank');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vessel_status AS ENUM ('scheduled', 'in-progress', 'complete', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE cell_status AS ENUM ('pending', 'in_progress', 'done', 'na');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE enquiry_status AS ENUM ('new', 'in-progress', 'quoted', 'won', 'lost', 'spam');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id            serial PRIMARY KEY,
  email         varchar(160) NOT NULL,
  password_hash text NOT NULL,
  name          varchar(120) NOT NULL,
  role          user_role NOT NULL DEFAULT 'supervisor',
  phone         varchar(40),
  active        integer NOT NULL DEFAULT 1,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email);

CREATE TABLE IF NOT EXISTS clients (
  id            serial PRIMARY KEY,
  name          varchar(160) NOT NULL,
  contact_name  varchar(120),
  contact_email varchar(160),
  contact_phone varchar(40),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vessels (
  id                serial PRIMARY KEY,
  reference         varchar(32) NOT NULL,
  name              varchar(160) NOT NULL,
  imo               varchar(16),
  port              varchar(160) NOT NULL,
  berth             varchar(120),
  type              vessel_type NOT NULL DEFAULT 'hold',
  status            vessel_status NOT NULL DEFAULT 'scheduled',
  client_id         integer REFERENCES clients (id) ON DELETE SET NULL,
  supervisor_id     integer REFERENCES users (id) ON DELETE SET NULL,
  stages            jsonb NOT NULL DEFAULT '[]'::jsonb,
  compartment_count integer NOT NULL DEFAULT 0,
  scheduled_for     timestamptz,
  started_at        timestamptz,
  completed_at      timestamptz,
  notes             text,
  share_token       varchar(64) NOT NULL,
  share_revoked     integer NOT NULL DEFAULT 0,
  version           integer NOT NULL DEFAULT 0,
  created_by_id     integer REFERENCES users (id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS vessels_reference_idx ON vessels (reference);
CREATE UNIQUE INDEX IF NOT EXISTS vessels_share_token_idx ON vessels (share_token);
CREATE INDEX IF NOT EXISTS vessels_supervisor_idx ON vessels (supervisor_id);
CREATE INDEX IF NOT EXISTS vessels_client_idx ON vessels (client_id);
CREATE INDEX IF NOT EXISTS vessels_status_idx ON vessels (status);

CREATE TABLE IF NOT EXISTS compartments (
  id         serial PRIMARY KEY,
  vessel_id  integer NOT NULL REFERENCES vessels (id) ON DELETE CASCADE,
  position   integer NOT NULL,
  label      varchar(40) NOT NULL,
  notes      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS compartments_vessel_position_idx ON compartments (vessel_id, position);
CREATE INDEX IF NOT EXISTS compartments_vessel_idx ON compartments (vessel_id);

CREATE TABLE IF NOT EXISTS cells (
  id              serial PRIMARY KEY,
  vessel_id       integer NOT NULL REFERENCES vessels (id) ON DELETE CASCADE,
  compartment_id  integer NOT NULL REFERENCES compartments (id) ON DELETE CASCADE,
  stage_key       varchar(40) NOT NULL,
  status          cell_status NOT NULL DEFAULT 'pending',
  note            varchar(160),
  updated_by_id   integer REFERENCES users (id) ON DELETE SET NULL,
  updated_by_name varchar(120),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS cells_compartment_stage_idx ON cells (compartment_id, stage_key);
CREATE INDEX IF NOT EXISTS cells_vessel_idx ON cells (vessel_id);

CREATE TABLE IF NOT EXISTS cell_events (
  id                serial PRIMARY KEY,
  vessel_id         integer NOT NULL REFERENCES vessels (id) ON DELETE CASCADE,
  compartment_id    integer NOT NULL,
  compartment_label varchar(40) NOT NULL,
  stage_key         varchar(40) NOT NULL,
  stage_label       varchar(80) NOT NULL,
  from_status       cell_status NOT NULL,
  to_status         cell_status NOT NULL,
  note              varchar(160),
  user_id           integer,
  user_name         varchar(120) NOT NULL,
  occurred_at       timestamptz NOT NULL DEFAULT now(),
  recorded_at       timestamptz NOT NULL DEFAULT now(),
  idempotency_key   varchar(64)
);
CREATE INDEX IF NOT EXISTS cell_events_vessel_idx ON cell_events (vessel_id);
CREATE INDEX IF NOT EXISTS cell_events_compartment_idx ON cell_events (compartment_id);
CREATE UNIQUE INDEX IF NOT EXISTS cell_events_idem_idx ON cell_events (idempotency_key);

CREATE TABLE IF NOT EXISTS enquiries (
  id         serial PRIMARY KEY,
  name       varchar(120) NOT NULL,
  email      varchar(160) NOT NULL,
  phone      varchar(40),
  company    varchar(160),
  vessel     varchar(120),
  service    varchar(200),
  message    text NOT NULL,
  status     enquiry_status NOT NULL DEFAULT 'new',
  ip_hash    varchar(64),
  user_agent varchar(255),
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status);
