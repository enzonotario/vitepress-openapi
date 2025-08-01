import { expect, test } from '@playwright/test'
import { examples } from '../../docs/sidebar-examples.ts'

const exampleSlugs = examples.map(example => example.slug)

test.describe('sidebar', () => {
  for (const exampleSlug of exampleSlugs) {
    test(exampleSlug, async ({ page }) => {
      await page.route('https://www.google-analytics.com/g/collect*', (route) => {
        route.fulfill({
          status: 204,
          body: '',
        })
      })

      await page.goto(`/sidebar-examples/${exampleSlug}`)

      await page.waitForSelector('h1')

      await expect(page).toHaveScreenshot({
        fullPage: true,
      })
    })
  }
})
