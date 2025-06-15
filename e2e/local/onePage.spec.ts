import { expect, test } from '@playwright/test'

test('onePage', async ({ page }) => {
  await page.goto('/one-page')

  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
