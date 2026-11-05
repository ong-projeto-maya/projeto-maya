/**
 * Server-side Supabase client using the secret key.
 * Use ONLY in Next.js API routes and webhook handlers.
 * Never expose the secret key to the browser — it bypasses Row Level Security.
 */
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getSecretKey } from './supabaseKeys'

export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = getSecretKey()

  if (!supabaseUrl || !secretKey) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY')
  }

  return createClient<Database>(supabaseUrl, secretKey)
}
