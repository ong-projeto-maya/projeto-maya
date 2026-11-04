/**
 * getClientIp — the key every rate limit in middleware.ts is counted against.
 *
 * It used to read the FIRST entry of x-forwarded-for, which is whatever the
 * caller sent, so rotating that header gave a fresh bucket on every request
 * and no limit held. These tests pin the order of trust.
 */
import { describe, it, expect } from 'vitest'
import { getClientIp } from '../lib/rate-limit'
import type { NextRequest } from 'next/server'

/** The two things getClientIp reads: request.ip and the headers. */
function makeRequest(headers: Record<string, string>, ip?: string): NextRequest {
  return {
    ip,
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as NextRequest
}

describe('getClientIp', () => {
  it('prefers request.ip, which the platform sets and the client cannot touch', () => {
    const req = makeRequest(
      { 'x-forwarded-for': '1.2.3.4', 'x-real-ip': '5.6.7.8' },
      '203.0.113.9'
    )
    expect(getClientIp(req)).toBe('203.0.113.9')
  })

  it('ignores a spoofed x-forwarded-for when x-real-ip is present', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4', 'x-real-ip': '203.0.113.9' })
    expect(getClientIp(req)).toBe('203.0.113.9')
  })

  it('takes the LAST entry of the x-forwarded-for chain, not the first', () => {
    // The client sent '1.2.3.4'; the proxy appended the address it really saw.
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' })
    expect(getClientIp(req)).toBe('203.0.113.9')
  })

  it('gives the same bucket however much the client prepends', () => {
    const a = getClientIp(makeRequest({ 'x-forwarded-for': '9.9.9.9, 203.0.113.9' }))
    const b = getClientIp(makeRequest({ 'x-forwarded-for': '8.8.8.8, 203.0.113.9' }))
    const c = getClientIp(makeRequest({ 'x-forwarded-for': '7.7.7.7, 6.6.6.6, 203.0.113.9' }))
    expect(new Set([a, b, c]).size).toBe(1)
    expect(a).toBe('203.0.113.9')
  })

  it('handles a single-entry chain', () => {
    expect(getClientIp(makeRequest({ 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9')
  })

  it('tolerates whitespace and trailing commas in the chain', () => {
    expect(getClientIp(makeRequest({ 'x-forwarded-for': '1.2.3.4 ,  203.0.113.9 , ' })))
      .toBe('203.0.113.9')
  })

  it('falls back to a constant when nothing identifies the caller', () => {
    // One shared bucket: stricter than intended, never weaker.
    expect(getClientIp(makeRequest({}))).toBe('127.0.0.1')
  })

  it('does not return an empty string for an empty header', () => {
    expect(getClientIp(makeRequest({ 'x-forwarded-for': '' }))).toBe('127.0.0.1')
    expect(getClientIp(makeRequest({ 'x-real-ip': '   ' }))).toBe('127.0.0.1')
  })
})
