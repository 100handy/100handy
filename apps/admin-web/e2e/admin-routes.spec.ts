import { expect, test } from '@playwright/test'
import { installSupabaseMocks } from './support/supabase-mocks'

const e2eAdminUserId = process.env.ADMIN_E2E_USER_ID ?? 'admin_e2e'

const adminRoutes = [
  '/dashboard',
  '/dashboard/announcements',
  '/users',
  `/users/profiles?id=${e2eAdminUserId}`,
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
