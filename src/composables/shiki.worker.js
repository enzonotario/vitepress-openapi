import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let shiki = null

// Track in-flight language loads to avoid duplicate requests
const languageLoadPromises = new Map()

/**
 * Vite will only bundle chunks for languages explicitly listed.
 *
 * Using granular @shikijs/langs/* imports instead of the bundledLanguages registry
 *
 * The registry alone pulls every language into the build.
 */
const LANGUAGE_IMPORTERS = {
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

const CORE_LANGUAGES = ['json', 'xml', 'markdown']

async function init(themes = []) {
  if (shiki) {
    return
  }

  const coreLangModules = await Promise.all(
    CORE_LANGUAGES.map(lang => LANGUAGE_IMPORTERS[lang]()),
  )

  shiki = await createHighlighterCore({
    themes,
    langs: coreLangModules,
    engine: createJavaScriptRegexEngine({ target: 'ES2018' }),
  })
}

// Handle messages from the main thread
globalThis.onmessage = async (e) => {
  const { type, id, payload } = e.data
  let loaded = false
  let html = ''
  try {
    switch (type) {
      case 'init':
        await init(payload.themes)
        globalThis.postMessage({ type: 'init-success', id })
        break

      case 'load-lang':
        if (!shiki) {
          throw new Error('Shiki not initialized')
        }
        if (!shiki.getLoadedLanguages().includes(payload.lang)) {
          const mod = await LANGUAGE_IMPORTERS[payload.lang]()
          await shiki.loadLanguage(mod)
        }
        globalThis.postMessage({ type: 'load-lang-success', id, lang: payload.lang })
        break

      case 'loaded-lang':
        if (!shiki) {
          throw new Error('Shiki not initialized')
        }
        loaded = shiki.getLoadedLanguages().includes(payload.lang)
        globalThis.postMessage({ type: 'loaded-lang-success', id, lang: payload.lang, loaded })
        break

      case 'render':
        if (!shiki) {
          throw new Error('Shiki not initialized')
        }
        html = shiki.codeToHtml(payload.content, {
          lang: payload.lang,
          theme: payload.theme,
        })
        globalThis.postMessage({ type: 'render-success', id, html })
        break

      case 'reset':
        shiki = null
        languageLoadPromises.clear()
        globalThis.postMessage({ type: 'reset-success', id })
        break

      default:
        break
    }
  } catch (error) {
    globalThis.postMessage({ type: 'error', id, error: error.message })
  }
}
