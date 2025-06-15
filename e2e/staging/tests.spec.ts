import { expect, test } from '@playwright/test'
import { testsPages } from '../../docs/pages'

const tests = testsPages.map(page => page.slug)

for (const testSlug of tests) {
  test(testSlug, async ({ page }) => {
    await page.goto(`/tests/${testSlug}`)

    await page.waitForSelector('h1')

    await expect(page).toHaveScreenshot({
      fullPage: true,
    })
  })
}
