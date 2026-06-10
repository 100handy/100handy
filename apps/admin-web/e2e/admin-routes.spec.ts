import { expect, test } from '@playwright/test'
import { ADMIN_ROUTE_SMOKE_TEST_PATHS } from '../src/lib/admin-route-permissions'
import { installSupabaseMocks } from './support/supabase-mocks'

const e2eAdminUserId = process.env.ADMIN_E2E_USER_ID ?? 'admin_e2e'
const adminRoutes = ADMIN_ROUTE_SMOKE_TEST_PATHS.map((route) => route.replace('admin_e2e', e2eAdminUserId))

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
