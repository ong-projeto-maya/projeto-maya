import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E configuration.
 * Tests run against a locally started Next.js dev server.
 * The server is auto-started by Playwright; each test file gets a fresh context.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One worker everywhere. Locally the suite runs against `next dev`, which
  // compiles each route on first request: parallel workers all wait on the
  // same cold compile and time out, which looks like a broken test.
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    // Ignore SSL errors caused by corporate MITM proxies during local dev
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Auto-start the Next.js dev server when running E2E tests locally.
  // In CI the server is started separately so webServer is conditionally skipped.
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
