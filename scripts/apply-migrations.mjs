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
 * Required environment variables:
 *   SUPABASE_URL              (or falls back to the hard-coded project URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://lnyzamgkxeyxgyoqpjmj.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY env var is required.')
  process.exit(1)
}

const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''
const API_URL     = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`

async function runSQL(label, sql) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${SERVICE_KEY}`,
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
