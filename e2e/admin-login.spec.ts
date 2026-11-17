import { test, expect } from '@playwright/test'

/**
 * Admin logada, contra o projeto de TESTE do Supabase
 * (teste-funcionarios-projeto-maya), nunca contra produção.
 *
 * Só roda quando E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD existem: no CI, pelo
 * job "E2E com login", que monta o site apontando para o projeto de teste.
 * Sem essas variáveis o teste é pulado, então o job de e2e comum, que usa um
 * Supabase falso, continua passando. Ver docs/dev-notes/PROJETO-DE-TESTE.md.
 */
const email = process.env.E2E_ADMIN_EMAIL
const senha = process.env.E2E_ADMIN_PASSWORD

test.describe('Admin logada (projeto de teste)', () => {
  test.skip(!email || !senha, 'Sem E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD: só roda contra o projeto de teste.')

  test('entra por /admin/login e chega ao painel', async ({ page }) => {
    await page.goto('/admin/login')

    // Os rótulos da tela não estão ligados aos campos, então o placeholder é
    // o que identifica cada um.
    await page.getByPlaceholder('seu@email.com').fill(email!)
    await page.getByPlaceholder('Digite sua senha').fill(senha!)
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()

    await expect(page).toHaveURL(/\/admin\/?$/)
    await expect(page.getByRole('heading', { name: /dashboard administrativo/i })).toBeVisible()
  })
})
