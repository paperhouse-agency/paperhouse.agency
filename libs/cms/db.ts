import { sql } from '@vercel/postgres'

export { sql }

let schemaReady: Promise<void> | null = null

export function getDb(): Promise<void> {
  if (!schemaReady) schemaReady = ensureSchema()
  return schemaReady
}

async function ensureSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS pages (
      id          TEXT         PRIMARY KEY,
      title       TEXT         NOT NULL,
      slug        TEXT         NOT NULL,
      status      TEXT         NOT NULL DEFAULT 'draft',
      seo         JSONB        NOT NULL DEFAULT '{}',
      settings    JSONB,
      blocks      JSONB        NOT NULL DEFAULT '[]',
      created_at  TIMESTAMPTZ  NOT NULL,
      updated_at  TIMESTAMPTZ  NOT NULL
    )
  `
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON pages (slug)`
  await sql`
    CREATE TABLE IF NOT EXISTS slots (
      id          TEXT         PRIMARY KEY,
      data        JSONB        NOT NULL,
      updated_at  TIMESTAMPTZ  NOT NULL
    )
  `
}
