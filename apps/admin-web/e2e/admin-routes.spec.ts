import { expect, type Page, test } from '@playwright/test'

const adminRoutes = [
  '/dashboard',
  '/dashboard/announcements',
  '/users',
  '/users/profiles?id=admin_e2e',
  '/tasks/categories',
  '/tasks/rollouts',
  '/tasks/categories/edit',
  '/tasks/list',
  '/tasks/open',
  '/tasks/scheduled',
  '/tasks/completed',
  '/tasks/cancelled',
  '/tasks/questions',
  '/handys',
  '/handys/stars',
  '/handys/selection-process',
  '/handys/availability',
  '/finance/earnings',
  '/finance/transactions',
  '/finance/payouts',
  '/finance/income',
  '/finance/rates',
  '/finance/payment-methods',
  '/finance/balances',
  '/finance/invoices',
  '/insights/analytics',
  '/insights/reports',
  '/promotions/management',
  '/outreach/leads',
  '/content/pages',
  '/content/page-settings',
  '/content/help-articles',
  '/content/blogs',
  '/content/media',
  '/content/faqs',
  '/content/navigation',
  '/content/app-content',
  '/accounts',
  '/accounts/security',
  '/accounts/verification',
  '/accounts/deleted',
  '/accounts/paused',
  '/accounts/service-areas',
  '/accounts/audit-log',
  '/accounts/timeline',
  '/notifications',
  '/notifications/email',
  '/notifications/push',
  '/notifications/popups',
  '/support/centre',
  '/support/reviews',
  '/support/disputes',
] as const

const authUser = {
  id: 'admin_e2e',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'admin-e2e@100handy.test',
  app_metadata: { role: 'admin' },
  user_metadata: {},
  created_at: new Date(0).toISOString(),
}

const adminProfile = {
  user_id: 'admin_e2e',
  role: 'admin',
  admin_role: 'super_admin',
  first_name: 'E2E',
  last_name: 'Admin',
  phone: null,
  avatar_url: null,
  account_status: 'active',
  status_reason: null,
}

test.beforeEach(async ({ page }) => {
  await installSupabaseMocks(page)
})

for (const route of adminRoutes) {
  test(`admin route renders without crashing: ${route}`, async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    page.on('console', (message) => {
      if (message.type() !== 'error') return
      const text = message.text()
      if (text.includes('Failed to load resource')) return
      errors.push(text)
    })

    await page.goto(route)
    await expect(page.locator('aside')).toContainText('100 Handy')
    await expect(page.locator('main, [role="main"], header').first()).toBeVisible()
    await expect(page.locator('text=Something went wrong')).toHaveCount(0)
    await expect(page.locator('text=Application error')).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

async function installSupabaseMocks(page: Page) {
  await page.route('**/__e2e_supabase/auth/v1/user**', async (route) => {
    await route.fulfill({ json: authUser })
  })

  await page.route('**/__e2e_supabase/auth/v1/token**', async (route) => {
    await route.fulfill({
      json: {
        access_token: 'admin-e2e-token',
        refresh_token: 'admin-e2e-refresh-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: authUser,
      },
    })
  })

  await page.route('**/__e2e_supabase/rest/v1/rpc/admin_dashboard_overview**', async (route) => {
    await route.fulfill({
      json: {
        metrics: {},
        trends: [],
        recentBookings: [],
        alerts: [],
      },
    })
  })

  await page.route('**/__e2e_supabase/rest/v1/rpc/**', async (route) => {
    await route.fulfill({ json: {} })
  })

  await page.route('**/__e2e_supabase/rest/v1/profiles**', async (route) => {
    await fulfillPostgrest(route, adminProfile)
  })

  await page.route('**/__e2e_supabase/rest/v1/site_settings**', async (route) => {
    await fulfillPostgrest(route, null)
  })

  await page.route('**/__e2e_supabase/rest/v1/**', async (route) => {
    await fulfillPostgrest(route, [])
  })
}

async function fulfillPostgrest(route: Parameters<Page['route']>[1] extends (route: infer R) => unknown ? R : never, data: unknown) {
  const request = route.request()
  const accept = request.headers().accept ?? ''
  const isObjectResponse = accept.includes('application/vnd.pgrst.object+json')
  const method = request.method()

  const body = method === 'GET'
    ? isObjectResponse
      ? Array.isArray(data)
        ? data[0] ?? null
        : data
      : Array.isArray(data)
        ? data
        : data
          ? [data]
          : []
    : isObjectResponse
      ? data ?? {}
      : []

  await route.fulfill({
    status: 200,
    headers: {
      'content-type': 'application/json',
      'content-range': '0-0/0',
    },
    body: JSON.stringify(body),
  })
}
