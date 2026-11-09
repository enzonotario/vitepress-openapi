import { expect, test } from '@playwright/test'
import { waitForStablePage } from '../utils'

test('onePage', async ({ page }) => {
  await page.goto('/one-page')
  await waitForStablePage(page)

  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
