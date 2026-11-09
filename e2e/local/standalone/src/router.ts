// Minimal history router for the example: links to the same origin are handled in-app,
// and links that only change the hash (e.g. header anchors) keep the default behavior.
import { nextTick, ref } from 'vue'

export const currentPath = ref(window.location.pathname)

export function navigate(to: string, { replace = false } = {}) {
  const url = new URL(to, window.location.href)
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
  currentPath.value = url.pathname

  nextTick(() => {
    const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)))
    if (target) {
      target.scrollIntoView()
    }
    else {
      window.scrollTo({ top: 0 })
    }
  })
}

export function setupRouter() {
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
  })

  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    if (link.target && link.target !== '_self') {
      return
    }

    const url = new URL(link.href)
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) {
      return
    }

    event.preventDefault()
    navigate(url.pathname + url.search + url.hash)
  })
}
