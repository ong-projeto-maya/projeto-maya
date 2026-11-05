#!/usr/bin/env node
/**
 * scripts/apply-migrations.mjs
 *
 * Applies all SQL files from supabase/migrations/ in filename order, then
 * optionally runs supabase/seed.sql when --seed flag is passed.
 *
 * Usage:
 *   node scripts/apply-migrations.mjs
 *   node scripts/apply-migrations.mjs --seed
 *
 * Required environment variables (both, no defaults):
 *   SUPABASE_URL           the project URL, e.g. https://abcd.supabase.co
 *   SUPABASE_ACCESS_TOKEN  a Supabase PERSONAL ACCESS TOKEN (starts with sbp_),
 *                          from supabase.com/dashboard/account/tokens
 *
 * The token is NOT the service role key, even though this script used to read
 * it from SUPABASE_SERVICE_ROLE_KEY. It posts to the Management API
 * (api.supabase.com), which only accepts a personal access token: passing the
 * service role key there fails with 401. The old variable name still works so
 * nothing breaks, but it was describing the wrong credential.
 *
 * SUPABASE_URL used to default to the production project, so running
 * `npm run db:migrate:seed` with no env set would seed production with example
 * data. There is no default any more: say which database you mean.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')

const SUPABASE_URL  = process.env.SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY kept as a fallback for whoever has it set already.
const ACCESS_TOKEN  = process.env.SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('ERROR: SUPABASE_URL env var is required — name the database explicitly.')
  console.error('       Local:      SUPABASE_URL=http://127.0.0.1:54321')
  console.error('       Production: the project URL, and only on purpose.')
  process.exit(1)
}

if (!ACCESS_TOKEN) {
  console.error('ERROR: SUPABASE_ACCESS_TOKEN env var is required.')
  console.error('       It is a personal access token (sbp_...), not the service role key:')
  console.error('       https://supabase.com/dashboard/account/tokens')
  process.exit(1)
}

if (ACCESS_TOKEN.startsWith('eyJ')) {
  console.error('ERROR: that looks like the service role key (a JWT), not a personal access token.')
  console.error('       The Management API only accepts a token starting with sbp_.')
  process.exit(1)
}

const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''
const API_URL     = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`

async function runSQL(label, sql) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const body = await res.text()
  if (!res.ok) {
    console.error(`[FAIL] ${label} (HTTP ${res.status}):`, body)
    process.exit(1)
  }
  console.log(`[OK]   ${label}`)
}

// ── Apply versioned migrations ───────────────────────────────────────────────
const migrationsDir = join(ROOT, 'supabase', 'migrations')
const files = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()           // lexicographic order = timestamp order

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf8')
  await runSQL(file, sql)
}

// ── Optionally run seed data ─────────────────────────────────────────────────
if (process.argv.includes('--seed')) {
  const seedPath = join(ROOT, 'supabase', 'seed.sql')
  const seedSQL  = readFileSync(seedPath, 'utf8')
  await runSQL('seed.sql', seedSQL)
}

console.log('\nAll migrations applied successfully.')
