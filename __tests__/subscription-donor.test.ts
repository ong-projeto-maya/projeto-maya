/**
 * getSubscriptionDonor — who a recurring charge belongs to.
 *
 * PagBank's SUBSCRIPTION_CHARGE carries no metadata, so the webhook has only
 * the subscription id and has to look the donor up. The cases below are the
 * ones that decide whether a monthly donation shows up in the right person's
 * history — or in the wrong one's.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const maybeSingleMock = vi.fn()
const fromMock = vi.fn()

vi.mock('@/lib/supabase-server', () => ({
  createServiceClient: () => ({ from: fromMock }),
}))
vi.mock('server-only', () => ({}))

import { getSubscriptionDonor } from '../lib/donationStorage'

function mockRow(result: { data?: unknown; error?: unknown }) {
  maybeSingleMock.mockResolvedValue({ data: result.data ?? null, error: result.error ?? null })
  const chain: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'limit']) chain[m] = vi.fn(() => chain)
  chain.maybeSingle = maybeSingleMock
  fromMock.mockReturnValue(chain)
  return chain
}

describe('getSubscriptionDonor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('links by account when the subscription has a doador_id', async () => {
    mockRow({ data: { doador_id: 'uuid-123', doador_email: 'ana@exemplo.com' } })
    await expect(getSubscriptionDonor('SUB_1')).resolves.toEqual({
      doadorId: 'uuid-123',
      email: 'ana@exemplo.com',
    })
  })

  it('trusts the account even when the row carries the anonymous e-mail', async () => {
    mockRow({ data: { doador_id: 'uuid-123', doador_email: 'anonymous@projetomaya.org' } })
    const donor = await getSubscriptionDonor('SUB_1')
    expect(donor?.doadorId).toBe('uuid-123')
  })

  it('links by e-mail when there is no account', async () => {
    mockRow({ data: { doador_id: null, doador_email: 'ana@exemplo.com' } })
    await expect(getSubscriptionDonor('SUB_1')).resolves.toEqual({ email: 'ana@exemplo.com' })
  })

  it('refuses to link an anonymous donation to anyone', async () => {
    mockRow({ data: { doador_id: null, doador_email: 'anonymous@projetomaya.org' } })
    await expect(getSubscriptionDonor('SUB_1')).resolves.toBeNull()
  })

  it('refuses to link the anonymous e-mail whatever its casing', async () => {
    mockRow({ data: { doador_id: null, doador_email: 'Anonymous@ProjetoMaya.org' } })
    await expect(getSubscriptionDonor('SUB_1')).resolves.toBeNull()
  })

  it('returns null when the row has neither account nor e-mail', async () => {
    mockRow({ data: { doador_id: null, doador_email: '' } })
    await expect(getSubscriptionDonor('SUB_1')).resolves.toBeNull()
  })

  it('returns null when no subscription row exists yet', async () => {
    mockRow({ data: null })
    await expect(getSubscriptionDonor('SUB_UNKNOWN')).resolves.toBeNull()
  })

  it('returns null when the query itself fails', async () => {
    mockRow({ error: { message: 'connection reset' } })
    await expect(getSubscriptionDonor('SUB_1')).resolves.toBeNull()
  })

  it('looks the subscription up by its PagBank id', async () => {
    const chain = mockRow({ data: { doador_id: 'uuid-123', doador_email: 'ana@exemplo.com' } })
    await getSubscriptionDonor('SUB_42')
    expect(fromMock).toHaveBeenCalledWith('assinaturas')
    expect(chain.eq).toHaveBeenCalledWith('pagbank_subscription_id', 'SUB_42')
  })
})
