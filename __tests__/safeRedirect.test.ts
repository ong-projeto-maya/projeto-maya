/**
 * safeRedirectPath — where someone lands after signing in.
 *
 * The value comes from the URL, so it is attacker-controlled: these are the
 * cases that keep a login link from becoming a redirect to someone else's site.
 */
import { describe, it, expect } from 'vitest'
import { safeRedirectPath } from '../lib/safeRedirect'

const FALLBACK = '/doador/dashboard'
const path = (value: string | null | undefined) =>
  safeRedirectPath(value, '/doador/', FALLBACK)

describe('safeRedirectPath', () => {
  it('honours an internal path under the allowed area', () => {
    expect(path('/doador/perfil')).toBe('/doador/perfil')
  })

  it('keeps the query string of the original page', () => {
    expect(path('/doador/doacoes?page=2')).toBe('/doador/doacoes?page=2')
  })

  it('falls back when nothing was passed', () => {
    expect(path(null)).toBe(FALLBACK)
    expect(path(undefined)).toBe(FALLBACK)
    expect(path('')).toBe(FALLBACK)
  })

  it('refuses an absolute URL to another host', () => {
    expect(path('https://evil.example.com')).toBe(FALLBACK)
    expect(path('http://evil.example.com/doador/')).toBe(FALLBACK)
  })

  it('refuses a protocol-relative URL', () => {
    // '//evil.com' is a different host, not a path on this one.
    expect(path('//evil.example.com')).toBe(FALLBACK)
    expect(path('/\\evil.example.com')).toBe(FALLBACK)
  })

  it('refuses a javascript: target', () => {
    expect(path('javascript:alert(1)')).toBe(FALLBACK)
  })

  it('refuses a path outside the area that was signed in to', () => {
    expect(path('/admin')).toBe(FALLBACK)
    expect(path('/admin/doadores')).toBe(FALLBACK)
    expect(path('/')).toBe(FALLBACK)
  })

  it('refuses a relative path', () => {
    expect(path('doador/perfil')).toBe(FALLBACK)
    expect(path('../admin')).toBe(FALLBACK)
  })

  it('keeps the admin area separate from the donor area', () => {
    expect(safeRedirectPath('/doador/perfil', '/admin', '/admin')).toBe('/admin')
    expect(safeRedirectPath('/admin/mensagens', '/admin', '/admin')).toBe('/admin/mensagens')
  })
})
