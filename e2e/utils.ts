import type { Page } from '@playwright/test'

export async function waitForStablePage(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(() => new Promise<void>((resolve) => {
    const start = Date.now()

    const waitForIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          if (Date.now() - start >= 500)
            resolve()
          else
            waitForIdle()
        })
      }
      else {
        setTimeout(resolve, 500)
      }
    }

    waitForIdle()
  }))

  let previousHeight = -1
  let stableRounds = 0

  while (stableRounds < 3) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight)

    if (height === previousHeight) {
      stableRounds++
    }
    else {
      stableRounds = 0
      previousHeight = height
    }

    await page.waitForTimeout(100)
  }
}
