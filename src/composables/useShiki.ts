import { useWebWorker } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useTheme } from './useTheme'

// A map to keep track of pending promises for the worker RPC
interface PendingRequest {
  resolve: (value: unknown | PromiseLike<unknown>) => void
  reject: (reason?: any) => void
}
const pendingRequests = new Map<string, PendingRequest>()
const loading = ref(true)
const initialized = ref(false)

// Initialize worker
const { post, data } = useWebWorker(
  new URL('./shiki.worker.js', import.meta.url).toString(),
  { type: 'module' },
)

export function useShiki() {
  const themeConfig = useTheme()

  // Watch for messages returning from the worker
  watch(data, (message) => {
    if (!message || !message.id) {
      return
    }
    const request = pendingRequests.get(message.id)
    if (!request) {
      return
    }

    if (message.type === 'error') {
      request.reject(message.error)
    } else {
      request.resolve(message)
    }
    pendingRequests.delete(message.id)
  })

  /**
   * Helper to send a command to the worker and return a promise
   */
  function callWorker(type: string, payload?: any): Promise<any> {
    const id = Date.now().toString(32)
    return new Promise((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject })
      post({ type, id, payload })
    })
  }

  /**
   * Initialize Shiki with core highlighters only (json, xml, markdown).
   * Additional languages are loaded on-demand via ensureLanguage().
   */
  async function init(): Promise<void> {
    if (initialized.value) {
      return
    }

    try {
      const themes = [
        themeConfig.getHighlighterTheme()?.light,
        themeConfig.getHighlighterTheme()?.dark,
      ]
      await callWorker('init', { themes })
      initialized.value = true
      loading.value = false
    } catch (err) {
      console.error('Shiki worker init failed:', err)
      throw err
    }
  }

  async function ensureLanguage(lang: string): Promise<boolean> {
    await init()
    try {
      await callWorker('load-lang', { lang })
      return true
    } catch {
      return false
    }
  }

  async function renderShiki(
    content: string,
    { lang, theme }: { lang: string, theme: string },
  ): Promise<string> {
    if (!initialized.value) {
      await init()
    }

    try {
      const response = await callWorker('render', { content, lang, theme })
      return response.html
    } catch {
      return `<pre><code>${content}</code></pre>`
    }
  }

  async function isLanguageLoaded(lang: string): Promise<boolean> {
    try {
      const response = await callWorker('loaded-lang', { lang })
      return !!response?.loaded
    } catch {
      return false
    }
  }

  async function reset() {
    try {
      await callWorker('reset')
    } catch {
    }
  }

  return {
    loading,
    renderShiki,
    init,
    ensureLanguage,
    get isReady() { return initialized.value },
    isLanguageLoaded,
    reset,
    /** @deprecated use init() */
    initShiki: async () => {
      console.warn('initShiki is deprecated, use init instead')
      await init()
    },
  }
}
