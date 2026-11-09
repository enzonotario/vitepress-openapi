import { expect, test } from '@playwright/test'

// Served by the second webServer in playwright.config.ts.
const STANDALONE_URL = 'http://localhost:4174'

// A plain Vue app (e2e/local/standalone) that uses `vitepress-openapi/vue` without VitePress.
test.describe('standalone Vue app', () => {
  test('renders an operation without VitePress', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text())
      }
    })

    await page.goto(STANDALONE_URL)

    await expect(page.locator('h1')).toContainText('Add a new artist')
    await expect(page.locator('.OAResponses')).toBeVisible()

    // Code samples: one tab visible at a time, switching works.
    const blocks = page.locator('.vp-code-group .blocks > div')
    await expect(blocks.filter({ visible: true })).toHaveCount(1)
    await page.locator('.vp-code-group .tabs label', { hasText: 'PHP' }).click()
    await expect(blocks.filter({ visible: true })).toContainText('curl_init')

    // Lazy JSON editor in the playground.
    await expect(page.locator('.oa-jse')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('follows the dark color scheme', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()

    await page.goto(STANDALONE_URL)

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('.vp-code-group pre.shiki').first()).toHaveClass(/vitesse-dark/)

    await context.close()
  })
})
