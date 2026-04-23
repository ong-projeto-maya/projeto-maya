/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const SUPABASE_HOSTNAME = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://lnyzamgkxeyxgyoqpjmj.supabase.co')
  .replace('https://', '')

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://*.sentry.io https://sentry.io",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        // Scoped to this specific Supabase project's storage
        hostname: SUPABASE_HOSTNAME,
      },
    ],
  },
}

module.exports = withSentryConfig(nextConfig, {
  // Sentry source map upload (only when SENTRY_AUTH_TOKEN is set)
  silent: true,
  org: process.env.SENTRY_ORG ?? '',
  project: process.env.SENTRY_PROJECT ?? 'projeto-maya',

  // Upload source maps only in CI / production builds
  disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,

  // Hide Sentry runtime warnings in logs
  hideSourceMaps: true,

  // Tree-shake Sentry debug code in production
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
})

