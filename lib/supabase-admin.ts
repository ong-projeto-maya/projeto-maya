/**
 * Browser-side Supabase client for admin authentication.
 * Uses a separate storageKey so the admin session is
 * completely isolated from the donor session.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export const createAdminClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { storageKey: 'maya_admin_supabase' } }
  )
