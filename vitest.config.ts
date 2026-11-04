import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    environment: 'node',
    globals: true,
    // Unit tests only. e2e/ holds Playwright specs, which Vitest cannot run —
    // without this they are collected and fail at import time.
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/api/**', 'lib/**'],
      exclude: ['lib/database.types.ts'],
      thresholds: {
        branches: 80,
        lines: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // 'server-only' is a build-time marker with no runtime module for Vitest
      // to load. Without this alias, any test importing lib/pagbank.ts fails
      // at import time.
      'server-only': path.resolve(__dirname, '__tests__/stubs/server-only.ts'),
    },
  },
})
