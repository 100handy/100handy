import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.ADMIN_E2E_PORT ?? 5177)
const supabaseMode = process.env.ADMIN_E2E_SUPABASE_MODE ?? 'mock'
const isLocalSupabase = supabaseMode === 'local'
const localSupabaseUrl = process.env.ADMIN_E2E_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const localSupabaseKey = process.env.ADMIN_E2E_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
const e2eAdminUserId = process.env.ADMIN_E2E_USER_ID ?? 'admin_e2e'

if (isLocalSupabase && !localSupabaseKey) {
  throw new Error('ADMIN_E2E_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY is required for local Supabase E2E.')
}

const supabaseUrl = isLocalSupabase ? localSupabaseUrl : `http://127.0.0.1:${port}/__e2e_supabase`
const supabaseKey = isLocalSupabase ? localSupabaseKey : 'e2e-anon-key'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `VITE_ADMIN_E2E_AUTH=true VITE_ADMIN_E2E_USER_ID=${e2eAdminUserId} VITE_SUPABASE_URL=${supabaseUrl} VITE_SUPABASE_ANON_KEY=${supabaseKey} pnpm exec vite --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
