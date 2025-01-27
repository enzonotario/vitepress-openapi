import { expect, test } from '@playwright/test'

test('one-page', async ({ page }) => {
  await page.goto('/one-page')

  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
