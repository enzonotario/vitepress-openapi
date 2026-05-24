import { expect, test } from '@playwright/test'

test('onePage', async ({ page }) => {
  await page.route('https://www.google-analytics.com/g/collect*', (route) => {
    route.fulfill({
      status: 204,
      body: '',
    })
  })

  await page.goto('/one-page')

  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
