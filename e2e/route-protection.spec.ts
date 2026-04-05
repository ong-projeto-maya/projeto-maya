import { test, expect } from '@playwright/test'

/**
 * Route protection E2E tests.
 *
 * Verifies that protected pages redirect to the appropriate login page
 * when the user is not authenticated.
 */
test.describe('Protected routes – redirect to login', () => {
  const DONOR_PROTECTED = [
    '/doador/dashboard',
    '/doador/perfil',
    '/doador/assinatura',
    '/doador/doacoes',
    '/doador/animais',
  ]

  const ADMIN_PROTECTED = ['/admin']

  for (const path of DONOR_PROTECTED) {
    test(`${path} redirects unauthenticated users to /doador/login`, async ({ page }) => {
      const response = await page.goto(path)

      // Either a redirect occurred, or we're now on the login page
      await expect(page).toHaveURL(/\/doador\/login/)
    })
  }

  for (const path of ADMIN_PROTECTED) {
    test(`${path} redirects unauthenticated users to /admin/login`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveURL(/\/admin\/login/)
    })
  }
})

test.describe('Login pages are publicly accessible', () => {
  test('/doador/login renders without redirect', async ({ page }) => {
    await page.goto('/doador/login')
    await expect(page).toHaveURL(/\/doador\/login/)
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('/admin/login renders without redirect', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.getByRole('heading')).toBeVisible()
  })
})
