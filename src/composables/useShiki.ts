import type { HighlighterCore, LanguageInput } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { ref } from 'vue'
import { useTheme } from './useTheme'

let shiki: HighlighterCore | null = null
let initPromise: Promise<void> | null = null

// Track in-flight language loads to avoid duplicate requests
const languageLoadPromises = new Map<string, Promise<boolean>>()

const loading = ref(true)

/**
 * Vite will only bundle chunks for languages explicitly listed.
 *
 * Using granular @shikijs/langs/* imports instead of the bundledLanguages registry 
 * 
 * The registry alone pulls every language into the build.
 */
const LANGUAGE_IMPORTERS: Record<string, () => Promise<LanguageInput>> = {
  json: () => import('@shikijs/langs/json').then(m => m.default),
  xml: () => import('@shikijs/langs/xml').then(m => m.default),
  markdown: () => import('@shikijs/langs/markdown').then(m => m.default),
  yaml: () => import('@shikijs/langs/yaml').then(m => m.default),
  typescript: () => import('@shikijs/langs/typescript').then(m => m.default),
  javascript: () => import('@shikijs/langs/javascript').then(m => m.default),
  bash: () => import('@shikijs/langs/bash').then(m => m.default),
  python: () => import('@shikijs/langs/python').then(m => m.default),
  php: () => import('@shikijs/langs/php').then(m => m.default),
}

const CORE_LANGUAGES: Array<keyof typeof LANGUAGE_IMPORTERS> = [
  'json', 'xml', 'markdown',
]

export function useShiki() {
  /**
   * Initialize Shiki with core highlighters only (json, xml, markdown).
   * Additional languages are loaded on-demand via ensureLanguage().
   */
  function init(): Promise<void> {
    if (initPromise) {
      return initPromise
    }

    initPromise = (async () => {
      try {
        if (shiki) {
          loading.value = false
          return
        }

        const themeConfig = useTheme()

        // invoke the importers and await them
        const coreLangModules = await Promise.all(
          CORE_LANGUAGES.map(lang => LANGUAGE_IMPORTERS[lang]())
        )

        shiki = await createHighlighterCore({
          themes: [
            themeConfig.getHighlighterTheme()?.light,
            themeConfig.getHighlighterTheme()?.dark,
          ],
          langs: coreLangModules,
          engine: createJavaScriptRegexEngine({ target: 'ES2018' }),
        })

        if (!shiki) {
          throw new Error('Failed to create Shiki highlighter')
        }

        loading.value = false
      } catch (error) {
        initPromise = null
        throw error
      }
    })()

    return initPromise
  }

  /**
   * Ensure a language is loaded. Loads it on-demand if not already available.
   * Returns true if the language is ready, false if it couldn't be loaded.
   */
  async function ensureLanguage(lang: string): Promise<boolean> {
    // Make sure shiki is initialized first
    try {
      await init()
    } catch (e) {
      console.error('Failed to initialize Shiki:', e)
      return false
    }

    if (!shiki) {
      return false
    }

    // Already loaded
    if (shiki.getLoadedLanguages().includes(lang)) {
      return true
    }

    // Check if already loading
    const existingPromise = languageLoadPromises.get(lang)
    if (existingPromise) {
      return existingPromise
    }

    // Start loading
    const importer = LANGUAGE_IMPORTERS[lang]

    if (!importer) {
      console.warn(`Shiki language "${lang}" not registered.`)
      return false
    }

    const loadPromise = importer()
      .then(mod => shiki!.loadLanguage(mod)
        .then(() => true))
      .catch(e => {
        console.error(`Failed to load Shiki language "${lang}":`, e)
        return false
      })
      .finally(() => languageLoadPromises.delete(lang))

    languageLoadPromises.set(lang, loadPromise)
    return loadPromise
  }

  function isReady(): boolean {
    return shiki !== null
  }

  function isLanguageLoaded(lang: string): boolean {
    return shiki?.getLoadedLanguages().includes(lang) ?? false
  }

  function renderShiki(
    content: string,
    { lang, theme }: { lang: string; theme: string },
  ): string {
    if (shiki && shiki?.getLoadedLanguages().includes(lang)) {
      return shiki.codeToHtml(content, {
        lang,
        theme,
      })
    } else {
      return `<pre><code>${content}</code></pre>`
    }
  }

  function reset() {
    shiki = null
    initPromise = null
    languageLoadPromises.clear()
    loading.value = true
  }

  return {
    loading,
    renderShiki,
    init,
    ensureLanguage,
    isReady,
    isLanguageLoaded,
    reset,
    /** @deprecated use init() */
    initShiki: async () => {
      console.warn('initShiki is deprecated, use init instead');
      await init()
    },
  }
}