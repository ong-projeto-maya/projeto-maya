import { test, expect } from '@playwright/test'

/**
 * Donation page E2E tests.
 *
 * /api/create-checkout-session is intercepted, so no real PagBank call is made
 * and the suite runs without PagBank credentials. The route answers with
 * { checkoutUrl }, and the page then sends the donor there — the mock points at
 * a local path so the navigation can be asserted without leaving the site.
 *
 * It replaces an earlier version written against Stripe, which the site no
 * longer uses: it mocked window.Stripe and expected a { sessionId } response.
 */

const MOCK_CHECKOUT_PATH = '/doacoes/sucesso?ref=REF_MOCK'

test.describe('Donation page', () => {
  test('renders the preset amounts and both donation types', async ({ page }) => {
    await page.goto('/doacoes')

    await expect(page.getByRole('heading', { name: /faça uma doação/i })).toBeVisible()

    for (const amount of [5, 10, 25, 50, 100, 250]) {
      await expect(page.getByRole('button', { name: `R$ ${amount}`, exact: true })).toBeVisible()
    }

    await expect(page.getByText('Doação Única')).toBeVisible()
    await expect(page.getByText('Doação Mensal')).toBeVisible()
  })

  test('the donate button shows the amount that is selected', async ({ page }) => {
    await page.goto('/doacoes')

    await page.getByRole('button', { name: 'R$ 100', exact: true }).click()
    await expect(page.getByRole('button', { name: /doar r\$ 100/i })).toBeVisible()
  })

  test('a custom amount replaces the selected preset', async ({ page }) => {
    await page.goto('/doacoes')

    await page.getByPlaceholder('Outro valor').fill('75')
    await expect(page.getByRole('button', { name: /doar r\$ 75/i })).toBeVisible()
  })

  test('sends the chosen amount and type, then goes to the checkout URL', async ({ page }) => {
    let requestBody: Record<string, unknown> | null = null

    await page.route('**/api/create-checkout-session', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ checkoutUrl: MOCK_CHECKOUT_PATH }),
      })
    })

    await page.goto('/doacoes')
    await page.getByRole('button', { name: 'R$ 25', exact: true }).click()
    await page.getByRole('button', { name: /doar r\$ 25/i }).click()

    await page.waitForURL('**/doacoes/sucesso**')
    expect(requestBody).toEqual({ amount: 25, donationType: 'single' })
  })

  test('sends donationType monthly when the monthly option is chosen', async ({ page }) => {
    let requestBody: Record<string, unknown> | null = null

    await page.route('**/api/create-checkout-session', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ checkoutUrl: MOCK_CHECKOUT_PATH }),
      })
    })

    await page.goto('/doacoes')
    await page.getByText('Doação Mensal').click()
    await page.getByRole('button', { name: 'R$ 50', exact: true }).click()
    await page.getByRole('button', { name: /doar mensalmente r\$ 50/i }).click()

    await page.waitForURL('**/doacoes/sucesso**')
    expect(requestBody).toEqual({ amount: 50, donationType: 'monthly' })
  })

  test('shows the error the server returned instead of redirecting', async ({ page }) => {
    await page.route('**/api/create-checkout-session', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Valor mínimo de R$ 5,00' }),
      })
    })

    await page.goto('/doacoes')
    await page.getByRole('button', { name: 'R$ 50', exact: true }).click()
    await page.getByRole('button', { name: /doar r\$ 50/i }).click()

    await expect(page.getByText('Valor mínimo de R$ 5,00')).toBeVisible()
    await expect(page).toHaveURL(/\/doacoes$/)
  })

  test('refuses an amount under R$5 without calling the API', async ({ page }) => {
    let apiCalled = false
    await page.route('**/api/create-checkout-session', async (route) => {
      apiCalled = true
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ checkoutUrl: MOCK_CHECKOUT_PATH }),
      })
    })

    await page.goto('/doacoes')
    await page.getByPlaceholder('Outro valor').fill('3')
    await page.getByRole('button', { name: /doar r\$ 3/i }).click()

    await expect(page.getByText(/valor válido \(mínimo r\$ 5\)/i)).toBeVisible()
    expect(apiCalled).toBe(false)
  })
})
