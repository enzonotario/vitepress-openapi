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

    await page.goto(`${STANDALONE_URL}/example/operations/createArtist`)

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

  test('mirrors the docs example pages', async ({ page }) => {
    await page.goto(STANDALONE_URL)

    // `/` redirects to the introduction (OAIntroduction + operations list).
    await expect(page).toHaveURL(/\/example\/introduction$/)
    await expect(page.locator('main h1').first()).toContainText('Argentine Rock Legends')

    // Operation link in the introduction.
    await page.locator('main a.OAOperationLink', { hasText: 'Add a new artist' }).first().click()
    await expect(page).toHaveURL(/\/example\/operations\/createArtist$/)
    await expect(page.locator('main h1')).toContainText('Add a new artist')
    await expect(page.locator('nav [aria-current="page"]')).toContainText('Add a new artist')

    // Operation link in a description, rewritten with markdown.operationLink.transformHref.
    await page.locator('main a.OAOperationLink', { hasText: 'Get an artist' }).first().click()
    await expect(page).toHaveURL(/\/example\/operations\/getArtist$/)
    await expect(page.locator('main h1')).toContainText('Get an artist')

    // One Page: OASpec with every operation. Header anchors stay on the page.
    await page.locator('nav a', { hasText: 'One Page' }).click()
    await expect(page).toHaveURL(/\/example\/one-page$/)
    await expect(page.locator('main .OAPath')).toHaveCount(9)
    await page.locator('main h2 .header-anchor').first().click({ force: true })
    await expect(page).toHaveURL(/\/example\/one-page#/)
    await expect(page.locator('main .OAPath')).toHaveCount(9)

    // Browser back.
    await page.goBack()
    await page.goBack()
    await expect(page).toHaveURL(/\/example\/operations\/getArtist$/)
  })

  test('renders the docs test pages', async ({ page }) => {
    await page.goto(`${STANDALONE_URL}/tests/parameters`)

    await expect(page.locator('main h1').first()).toContainText('Parameter Testing API')
    await expect(page.locator('main .OAPath')).not.toHaveCount(0)
    await expect(page.locator('nav [aria-current="page"]')).toHaveText('Parameters')
  })

  test('switches between light and dark from the navbar', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(`${STANDALONE_URL}/example/operations/createArtist`)

    const html = page.locator('html')
    const appearanceSwitch = page.getByRole('switch')
    const codeBlock = page.locator('.vp-code-group pre.shiki').first()

    await expect(page.locator('header.navbar')).toContainText('Argentine Rock Legends')
    await expect(html).not.toHaveClass(/dark/)
    await expect(codeBlock).toHaveClass(/vitesse-light/)

    // The switch writes `useTheme().isDark`; the components follow it.
    await appearanceSwitch.click()
    await expect(html).toHaveClass(/dark/)
    await expect(appearanceSwitch).toHaveAttribute('aria-checked', 'true')
    await expect(codeBlock).toHaveClass(/vitesse-dark/)

    // The choice is kept after a reload.
    await page.reload()
    await expect(html).toHaveClass(/dark/)
  })

  test('copies code samples with the copy button', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions are only available in Chromium.')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto(`${STANDALONE_URL}/example/operations/getAllArtists`)

    const block = page.locator('.vp-code-group .blocks > div.active')
    await block.hover()
    await block.locator('button.copy').click()

    await expect(block.locator('button.copy')).toHaveClass(/copied/)
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('curl')
  })

  test('follows the dark color scheme', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()

    await page.goto(`${STANDALONE_URL}/example/operations/getAllArtists`)

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('.vp-code-group pre.shiki').first()).toHaveClass(/vitesse-dark/)

    await context.close()
  })
})
