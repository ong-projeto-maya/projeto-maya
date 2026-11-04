/**
 * validateWebhookSignature — the guard on /api/webhook.
 *
 * This endpoint is public, unauthenticated and writes to the database with the
 * service role key, so the only thing standing between the internet and the
 * donations table is this function. The cases below are the ones that decide
 * whether it holds.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { validateWebhookSignature } from '../lib/pagbank'

const TOKEN = 'webhook-token-123'
const body = '{"type":"CHARGE"}'

let env: NodeJS.ProcessEnv

beforeEach(() => {
  env = { ...process.env }
})

afterEach(() => {
  process.env = env
})

describe('validateWebhookSignature', () => {
  describe('production', () => {
    beforeEach(() => {
      process.env.PAGBANK_ENVIRONMENT = 'production'
    })

    it('rejects everything when the token is not configured', () => {
      delete process.env.PAGBANK_WEBHOOK_TOKEN
      expect(validateWebhookSignature(body, 'anything')).toBe(false)
      expect(validateWebhookSignature(body, null)).toBe(false)
    })

    it('rejects a request with no signature', () => {
      process.env.PAGBANK_WEBHOOK_TOKEN = TOKEN
      expect(validateWebhookSignature(body, null)).toBe(false)
    })

    it('rejects a wrong signature', () => {
      process.env.PAGBANK_WEBHOOK_TOKEN = TOKEN
      expect(validateWebhookSignature(body, 'wrong-token-1234')).toBe(false)
    })

    it('rejects a signature of a different length', () => {
      process.env.PAGBANK_WEBHOOK_TOKEN = TOKEN
      expect(validateWebhookSignature(body, 'short')).toBe(false)
    })

    it('accepts the correct signature', () => {
      process.env.PAGBANK_WEBHOOK_TOKEN = TOKEN
      expect(validateWebhookSignature(body, TOKEN)).toBe(true)
    })
  })

  describe('sandbox', () => {
    beforeEach(() => {
      process.env.PAGBANK_ENVIRONMENT = 'sandbox'
    })

    it('allows an unsigned webhook — sandbox does not send the header', () => {
      process.env.PAGBANK_WEBHOOK_TOKEN = TOKEN
      expect(validateWebhookSignature(body, null)).toBe(true)
    })

    it('allows everything when the token is not configured', () => {
      delete process.env.PAGBANK_WEBHOOK_TOKEN
      expect(validateWebhookSignature(body, null)).toBe(true)
    })

    it('still rejects a wrong signature when one is sent', () => {
      process.env.PAGBANK_WEBHOOK_TOKEN = TOKEN
      expect(validateWebhookSignature(body, 'wrong-token-1234')).toBe(false)
    })
  })

  describe('environment unset (local development)', () => {
    it('does not behave as production', () => {
      delete process.env.PAGBANK_ENVIRONMENT
      delete process.env.PAGBANK_WEBHOOK_TOKEN
      expect(validateWebhookSignature(body, null)).toBe(true)
    })
  })
})
