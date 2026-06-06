'use client'

// Re-exports types so existing imports still work
export type { Doador, Donation, Subscription } from '@/contexts/DoadorContext'

// The hook is a thin proxy to DoadorContext.
// All state lives in a single provider, so multiple components calling
// useDoador() share the same instance — no duplicate Supabase queries.
export { useDoadorContext as useDoador } from '@/contexts/DoadorContext'
