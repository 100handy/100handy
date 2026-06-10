import { expect, test } from '@playwright/test'
import { ADMIN_ROUTE_SMOKE_TEST_PATHS } from '../src/lib/admin-route-permissions'
import { installSupabaseMocks } from './support/supabase-mocks'

const e2eAdminUserId = process.env.ADMIN_E2E_USER_ID ?? 'admin_e2e'
const adminRoutes = ADMIN_ROUTE_SMOKE_TEST_PATHS.map((route) => route.replace('admin_e2e', e2eAdminUserId))

const viewports = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

test.beforeEach(async ({ page }) => {
  await installSupabaseMocks(page)
})

for (const viewport of viewports) {
  for (const route of adminRoutes) {
    test(`admin screen stays readable on ${viewport.name}: ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      await page.goto(route)
      await expect(page.locator('main, [role="main"], header').first()).toBeVisible()
      await expect(page.locator('text=Something went wrong')).toHaveCount(0)
      await expect(page.locator('text=Application error')).toHaveCount(0)

      const horizontalPageScroll = await page.evaluate(() => {
        const originalX = window.scrollX
        const originalY = window.scrollY
        window.scrollTo(document.documentElement.scrollWidth, originalY)
        const scrolledX = window.scrollX
        window.scrollTo(originalX, originalY)
        return scrolledX
      })

      expect(horizontalPageScroll, `${route} allows page-level horizontal panning on ${viewport.name}`).toBeLessThanOrEqual(2)

      const bodyText = await page.locator('body').innerText()
      expect(bodyText).not.toMatch(/\b(undefined|NaN)\b|\[object Object\]/)
    })
  }
}
