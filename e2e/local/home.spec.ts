import { expect, test } from '@playwright/test'

test('home', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/VitePress OpenAPI/)
  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
