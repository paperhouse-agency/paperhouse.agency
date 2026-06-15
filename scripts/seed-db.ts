import { neon } from '@neondatabase/serverless'

async function main() {
  const url = process.env.POSTGRES_URL
  if (!url) {
    console.error('Error: POSTGRES_URL is not set')
    process.exit(1)
  }

  const host = url.split('@')[1]?.split('/')[0] ?? 'unknown host'
  console.log(`\nConnecting to: ${host}`)

  const sql = neon(url)

  console.log('Creating tables...')
  await sql(`
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
  `)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON pages (slug)`)
  await sql(`
    CREATE TABLE IF NOT EXISTS slots (
      id          TEXT         PRIMARY KEY,
      data        JSONB        NOT NULL,
      updated_at  TIMESTAMPTZ  NOT NULL
    )
  `)
  console.log('✓ Done')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
