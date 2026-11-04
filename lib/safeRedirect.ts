/**
 * Where to send someone after they sign in.
 *
 * The middleware already puts the page they were trying to reach in a
 * `redirectTo` query parameter, but nothing ever read it, so everyone landed
 * on the dashboard and lost the page they asked for.
 *
 * A redirect target that comes from the URL is attacker-controlled, so it is
 * only honoured when it is unmistakably an internal path under `allowedPrefix`:
 *
 * - must start with a single '/', never '//' (that is protocol-relative and
 *   goes to another host) and never '/\' (some browsers normalise it the same
 *   way);
 * - must not carry a scheme, so no 'javascript:' and no 'https://evil.com';
 * - must sit under the area the person just signed in to, so an admin link
 *   cannot be smuggled into the donor login and the other way round.
 *
 * Anything else falls back to `fallback`.
 */
export function safeRedirectPath(
  redirectTo: string | null | undefined,
  allowedPrefix: string,
  fallback: string
): string {
  if (!redirectTo) return fallback
  if (!redirectTo.startsWith('/')) return fallback
  if (redirectTo.startsWith('//') || redirectTo.startsWith('/\\')) return fallback
  if (redirectTo.includes(':')) return fallback
  if (!redirectTo.startsWith(allowedPrefix)) return fallback
  return redirectTo
}
