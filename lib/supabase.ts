/**
 * Browser-side Supabase client for donor authentication.
 *
 * NOTE: this used to say it kept donor and admin sessions apart with a
 * dedicated storageKey. It does not — the options object is empty, so this
 * client and lib/supabase-admin.ts share the default session cookie. In
 * practice signing in as admin signs the donor out, and the other way round.
 *
 * Separating them means giving each client its own storageKey AND teaching
 * every createServerClient (middleware.ts, app/api/create-checkout-session)
 * the matching name, otherwise the server stops seeing the session at all.
 * Worth doing against the real Supabase project, not blind.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getPublishableKey } from './supabaseKeys'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const publishableKey = getPublishableKey() ?? ''

export const isSupabaseConfigured = Boolean(supabaseUrl && publishableKey)

export const createClient = () =>
  createBrowserClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    publishableKey || 'placeholder-publishable-key',
    {}
  )
