import { expect, test } from '@playwright/test'

test('home', async ({ page }) => {
  await page.route('https://www.google-analytics.com/g/collect*', (route) => {
    route.fulfill({
      status: 204,
      body: '',
    })
  })

  await page.goto('/')

  await expect(page).toHaveTitle(/VitePress OpenAPI/)
  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
