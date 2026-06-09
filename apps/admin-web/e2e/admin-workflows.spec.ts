import { expect, test } from '@playwright/test'
import { installSupabaseMocks } from './support/supabase-mocks'

test.beforeEach(async ({ page }) => {
  await installSupabaseMocks(page)
})

test('content team can search the page library and open an editor', async ({ page }) => {
  await page.goto('/content/pages')

  await expect(page.getByRole('heading', { name: 'Pages library' })).toBeVisible()
  await page.getByPlaceholder('Search pages...').fill('home')
  await expect(page.getByRole('cell', { name: 'Home' }).first()).toBeVisible()
  await page.getByRole('link', { name: 'Edit page' }).first().click()

  await expect(page).toHaveURL(/\/content\/pages\/.+/)
  await expect(page.getByRole('heading', { name: 'Edit Page: Home' })).toBeVisible()
  await page.getByRole('link', { name: 'Pages' }).click()
  await expect(page).toHaveURL(/\/content\/pages$/)
})

test('popup editor blocks empty drafts with visible validation', async ({ page }) => {
  await page.goto('/notifications/popups')

  await page.getByRole('button', { name: 'New Pop-up' }).click()
  await page.getByRole('button', { name: 'Editor' }).click()

  await expect(page.getByRole('heading', { name: 'Create Pop-up' })).toBeVisible()
  await expect(page.getByText('Pop-up title is required.')).toBeVisible()
  await expect(page.getByText('Content is required.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save Draft' })).toBeDisabled()
})

test('announcement editor blocks empty drafts with visible validation', async ({ page }) => {
  await page.goto('/dashboard/announcements')

  await page.getByRole('button', { name: 'New Announcement' }).click()
  await page.getByRole('button', { name: 'Editor' }).click()

  await expect(page.getByRole('heading', { name: 'Create Announcement' })).toBeVisible()
  await expect(page.getByText('Title is required.')).toBeVisible()
  await expect(page.getByText('Body is required.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save Draft' })).toBeDisabled()
})

test('admin shell shows a recovery UI when a screen crashes', async ({ page }) => {
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('E2E admin crash boundary probe')) {
      throw new Error(message.text())
    }
  })

  await page.goto('/__e2e/crash')

  await expect(page.getByRole('heading', { name: 'Something went wrong' })).toBeVisible()
  await expect(page.getByText('E2E admin crash boundary probe')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
})
