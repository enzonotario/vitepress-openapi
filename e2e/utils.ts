import type { Page } from '@playwright/test'

const IDLE_STABILIZATION_MS = 500
const IDLE_DEADLINE_MS = 5000
const SCROLL_STABLE_ROUNDS = 3
const SCROLL_POLL_MS = 100
const SCROLL_DEADLINE_MS = 5000

export async function waitForStablePage(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(({ idleMs, deadlineMs }) => new Promise<void>((resolve, reject) => {
    const start = Date.now()
    let settled = false

    const settle = (fn: () => void) => {
      if (!settled) {
        settled = true
        clearTimeout(deadlineTimer)
        fn()
      }
    }

    const deadlineTimer = setTimeout(() => {
      settle(() => reject(new Error(
        `waitForIdle timed out after ${deadlineMs}ms waiting for requestIdleCallback stabilization`,
      )))
    }, deadlineMs)

    const waitForIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          if (Date.now() - start >= idleMs) {
            settle(resolve)
          }
          else {
            waitForIdle()
          }
        })
      }
      else {
        setTimeout(settle, idleMs, resolve)
      }
    }

    waitForIdle()
  }), { idleMs: IDLE_STABILIZATION_MS, deadlineMs: IDLE_DEADLINE_MS })

  let previousHeight = -1
  let stableRounds = 0
  const scrollStart = Date.now()

  while (stableRounds < SCROLL_STABLE_ROUNDS) {
    if (Date.now() - scrollStart >= SCROLL_DEADLINE_MS) {
      break
    }

    const height = await page.evaluate(() => document.documentElement.scrollHeight)

    if (height === previousHeight) {
      stableRounds++
    }
    else {
      stableRounds = 0
      previousHeight = height
    }

    await page.waitForTimeout(SCROLL_POLL_MS)
  }
}
