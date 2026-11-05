/**
 * Reads the Supabase API keys from the environment.
 *
 * Supabase is deprecating the `anon` and `service_role` keys by the end of
 * 2026, replacing them with a publishable key (`sb_publishable_...`) for
 * public code and a secret key (`sb_secret_...`) for servers. Both formats
 * work at the same time, and both are read from the same Dashboard page:
 * Settings > API Keys.
 *
 * So the new names win here and the old ones stay as a fallback. That way a
 * deploy whose variables were set before the rename keeps working, and so
 * does a local .env that still carries the legacy pair.
 *
 * Once the legacy keys are switched off in the Dashboard, delete the
 * fallbacks and the old names with them.
 *
 * https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
 */

/** Safe to send to the browser. Row Level Security is what protects the data. */
export const getPublishableKey = (): string | undefined =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Server only. Bypasses Row Level Security — never let it reach the browser. */
export const getSecretKey = (): string | undefined =>
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY
