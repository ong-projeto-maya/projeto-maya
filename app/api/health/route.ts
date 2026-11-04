import { NextResponse } from 'next/server'

// GET /api/health — lightweight liveness probe used by Vercel cron and uptime monitors.
// Checks that the process can respond; does NOT check upstream dependencies (Supabase/PagBank)
// to avoid false alarms on transient third-party outages.
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    },
    {
      status: 200,
      headers: {
        // Prevent CDN/browser caching so monitors always get a fresh response
        'Cache-Control': 'no-store',
      },
    }
  )
}
