import { expect, test } from '@playwright/test'
import { examples } from '../../docs/sidebar-examples.ts'

const exampleSlugs = examples.map(example => example.slug)

for (const exampleSlug of exampleSlugs) {
  test(`sidebar example: ${exampleSlug}`, async ({ page }) => {
    await page.goto(`/sidebar-examples/${exampleSlug}`)

    await page.waitForSelector('h1')

    await expect(page).toHaveScreenshot({
      fullPage: true,
    })
  })
}
