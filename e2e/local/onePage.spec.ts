import { expect, test } from '@playwright/test'
import { waitForStablePage } from '../utils'

test('onePage', async ({ page }) => {
  // Heavy page: every operation, with lazy JSON editors to wait for.
  test.slow()

  await page.goto('/one-page')
  await waitForStablePage(page)

  await expect(page).toHaveScreenshot({
    fullPage: true,
  })
})
