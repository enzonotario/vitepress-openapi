import { expect, test } from '@playwright/test'
import { testsPages } from '../../docs/pages'

const pageSlugs = testsPages.map(page => page.slug)

for (const pageSlug of pageSlugs) {
  test(pageSlug, async ({ page }) => {
    await page.route('https://www.google-analytics.com/g/collect*', (route) => {
      route.fulfill({
        status: 204,
        body: '',
      })
    })

    await page.goto(`/tests/${pageSlug}`)

    await page.waitForSelector('h1')

    await expect(page).toHaveScreenshot({
      fullPage: true,
    })
  })
}
