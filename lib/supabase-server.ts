/**
 * Server-side Supabase client using the service role key.
 * Use ONLY in Next.js API routes and webhook handlers.
 * Never expose the service role key to the browser.
 */
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
}

export const createServiceClient = () =>
  createClient<Database>(supabaseUrl, serviceRoleKey)
