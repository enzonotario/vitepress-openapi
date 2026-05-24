import type { HighlighterCore } from 'shiki/core'
import type { BundledLanguage } from 'shiki/langs'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { bundledLanguages as highlighterImports } from 'shiki/langs'
import { ref } from 'vue'
import { useTheme } from './useTheme'

// Core highlighters always loaded for response body highlighting (not shown in code samples UI)
const CORE_HIGHLIGHTERS: BundledLanguage[] = ['json', 'xml', 'markdown']

let shiki: HighlighterCore | null = null
let initPromise: Promise<void> | null = null

// Track in-flight language loads to avoid duplicate requests
const languageLoadPromises = new Map<string, Promise<boolean>>()

const loading = ref(true)

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

        // Load only core highlighters during init
        const coreLangModules = await Promise.all(
          CORE_HIGHLIGHTERS.map(async (lang) => {
            const importer = highlighterImports[lang]
            if (!importer) {
              return []
            }
            try {
              const mod = await importer()
              return mod.default
            } catch {
              return []
            }
          }),
        )

        shiki = await createHighlighterCore({
          themes: [
            themeConfig.getHighlighterTheme()?.light,
            themeConfig.getHighlighterTheme()?.dark,
          ],
          langs: coreLangModules.filter(Boolean).flat(),
          engine: createJavaScriptRegexEngine({
            target: 'ES2018',
          }),
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
    const loadPromise = (async () => {
      const importer = highlighterImports[lang as BundledLanguage]

      if (!importer) {
        console.warn(`Shiki language "${lang}" not available.`)
        return false
      }

      try {
        const mod = await importer()
        await shiki!.loadLanguage(mod.default)
        return true
      } catch (e) {
        console.error(`Failed to load Shiki language "${lang}":`, e)
        return false
      } finally {
        languageLoadPromises.delete(lang)
      }
    })()

    languageLoadPromises.set(lang, loadPromise)
    return loadPromise
  }

  function isReady(): boolean {
    return shiki !== null
  }

  function isLanguageLoaded(lang: string): boolean {
    return shiki?.getLoadedLanguages().includes(lang) ?? false
  }

  function renderShiki(content: string, { lang, theme }: { lang: string, theme: string }) {
    if (shiki && shiki.getLoadedLanguages().includes(lang)) {
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
    initShiki: async () => {
      console.warn('initShiki is deprecated, use init instead')
      await init()
    },
  }
}
