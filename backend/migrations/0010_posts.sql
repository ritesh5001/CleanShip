-- The blog.
--
-- Posts are written in the admin panel and read by the public site. The body
-- is Markdown: `##` and `###` headings become the article's table of contents
-- and its #anchor links, which is why the heading structure is the one rule
-- an author has to follow.
--
-- FAQs and sources are stored as JSON arrays rather than child tables: they
-- are always read and written with the post, never on their own, and a post
-- has a handful of each.

CREATE TABLE IF NOT EXISTS posts (
  id              serial PRIMARY KEY,
  slug            varchar(160) NOT NULL UNIQUE,
  title           varchar(200) NOT NULL,
  seo_title       varchar(80),
  description     varchar(320) NOT NULL DEFAULT '',
  category        varchar(80)  NOT NULL DEFAULT '',
  keywords        jsonb        NOT NULL DEFAULT '[]'::jsonb,
  lead            text         NOT NULL DEFAULT '',
  body            text         NOT NULL DEFAULT '',
  faqs            jsonb        NOT NULL DEFAULT '[]'::jsonb,
  sources         jsonb        NOT NULL DEFAULT '[]'::jsonb,
  cover_image_url text,
  cover_image_alt varchar(200),
  author_name     varchar(120) NOT NULL DEFAULT '',
  author_role     varchar(160),
  status          varchar(16)  NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published')),
  noindex         boolean      NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_status_published_idx
  ON posts (status, published_at DESC);
