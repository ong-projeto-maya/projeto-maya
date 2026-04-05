/**
 * Browser-side Supabase client for donor authentication.
 * Uses a dedicated storageKey so donor and admin sessions
 * are kept separate in localStorage.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { storageKey: 'maya_donor_supabase' } }
  )
