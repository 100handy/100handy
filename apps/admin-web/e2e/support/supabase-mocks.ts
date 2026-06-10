import type { Page, Route } from '@playwright/test'

const authUser = {
  id: process.env.ADMIN_E2E_USER_ID ?? 'admin_e2e',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'admin-e2e@100handy.test',
  app_metadata: { role: 'admin' },
  user_metadata: {},
  created_at: new Date(0).toISOString(),
}

const adminProfile = {
  user_id: authUser.id,
  role: 'admin',
  admin_role: 'super_admin',
  first_name: 'E2E',
  last_name: 'Admin',
  phone: null,
  avatar_url: null,
  account_status: 'active',
  status_reason: null,
}

export async function installSupabaseMocks(page: Page) {
  await installSupabaseAuthMocks(page)

  if (process.env.ADMIN_E2E_SUPABASE_MODE === 'local') {
    return
  }

  await installSupabaseDataMocks(page)
}

async function installSupabaseAuthMocks(page: Page) {
  await page.route('**/auth/v1/user**', async (route) => {
    await route.fulfill({ json: authUser })
  })

  await page.route('**/auth/v1/token**', async (route) => {
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
}

async function installSupabaseDataMocks(page: Page) {
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

async function fulfillPostgrest(route: Route, data: unknown) {
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
