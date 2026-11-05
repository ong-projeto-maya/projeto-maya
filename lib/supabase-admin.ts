/**
 * Browser-side Supabase client for admin authentication.
 *
 * NOTE: the admin session is NOT isolated from the donor session, despite
 * what this comment used to claim — see lib/supabase.ts for why and for what
 * separating them would take.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getPublishableKey } from './supabaseKeys'

export const createAdminClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    getPublishableKey() ?? 'placeholder-publishable-key',
    {}
  )
