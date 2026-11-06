import { test, expect } from '@playwright/test'

/**
 * Donation page E2E tests.
 *
 * The page no longer calls /api/create-checkout-session. That route needs a
 * PagBank token the project does not have, so every donation failed. It now
 * sends the donor straight to the monthly subscription links the NGO already
 * had published, and shows the PIX details for one-off donations.
 *
 * These tests replace an earlier version written against the API flow, which
 * mocked the checkout route and asserted the redirect it answered with.
 */

/** The amounts that have a real PagBank subscription behind them. */
const VALORES_MENSAIS = [5, 10, 30, 50, 80, 150, 300]

test.describe('Donation page', () => {
  test('opens on the monthly option and lists only the amounts that exist', async ({ page }) => {
    await page.goto('/doacoes')

    await expect(page.getByRole('heading', { name: /faça uma doação/i })).toBeVisible()

    for (const valor of VALORES_MENSAIS) {
      await expect(page.getByRole('button', { name: `R$ ${valor}`, exact: true })).toBeVisible()
    }

    // R$ 100 has no subscription of its own: the NGO's R$ 100 link charges R$ 80.
    await expect(page.getByRole('button', { name: 'R$ 100', exact: true })).toHaveCount(0)

    await expect(page.getByText('Doação Mensal')).toBeVisible()
    await expect(page.getByText('Doação Única')).toBeVisible()
  })

  test('the button points at the PagBank link for the chosen amount', async ({ page }) => {
    await page.goto('/doacoes')

    await page.getByRole('button', { name: 'R$ 50', exact: true }).click()
    const apoiar = page.getByRole('link', { name: /apoiar com r\$ 50 por mês/i })
    await expect(apoiar).toBeVisible()
    await expect(apoiar).toHaveAttribute('href', 'https://pag.ae/81Gi4k_Kp')

    await page.getByRole('button', { name: 'R$ 300', exact: true }).click()
    await expect(page.getByRole('link', { name: /apoiar com r\$ 300 por mês/i })).toHaveAttribute(
      'href',
      'https://pag.ae/81GiakDg4',
    )
  })

  test('every amount has a distinct pag.ae link', async ({ page }) => {
    await page.goto('/doacoes')

    const vistos = new Set<string>()
    for (const valor of VALORES_MENSAIS) {
      await page.getByRole('button', { name: `R$ ${valor}`, exact: true }).click()
      const href = await page
        .getByRole('link', { name: new RegExp(`apoiar com r\\$ ${valor} por mês`, 'i') })
        .getAttribute('href')
      expect(href).toMatch(/^https:\/\/pag\.ae\//)
      expect(vistos.has(href!)).toBe(false)
      vistos.add(href!)
    }
    expect(vistos.size).toBe(VALORES_MENSAIS.length)
  })

  test('the one-off option shows the PIX key instead of a checkout', async ({ page }) => {
    await page.goto('/doacoes')

    await page.getByText('Doação Única').click()

    await expect(page.getByRole('heading', { name: /doe por pix/i })).toBeVisible()
    await expect(page.getByText('projetomaya@outlook.com').first()).toBeVisible()
    await expect(page.getByText('42.686.223/0001-02')).toBeVisible()
    await expect(page.getByRole('button', { name: /copiar/i })).toBeVisible()

    // Nothing here should promise a card checkout.
    await expect(page.getByRole('link', { name: /apoiar com r\$/i })).toHaveCount(0)
  })

  test('?type=single opens straight on the PIX details', async ({ page }) => {
    await page.goto('/doacoes?type=single')

    await expect(page.getByRole('heading', { name: /doe por pix/i })).toBeVisible()
  })

  test('the page never calls the checkout API', async ({ page }) => {
    let apiCalled = false
    await page.route('**/api/create-checkout-session', async (route) => {
      apiCalled = true
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    })

    await page.goto('/doacoes')
    await page.getByRole('button', { name: 'R$ 30', exact: true }).click()
    await page.getByText('Doação Única', { exact: true }).click()
    await page.getByText('Doação Mensal', { exact: true }).click()

    expect(apiCalled).toBe(false)
  })
})
