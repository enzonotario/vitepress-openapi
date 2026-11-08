import type { HighlighterCore, LanguageRegistration } from 'shiki/core'
import type { BundledLanguage } from 'shiki/langs'
import { bundledLanguages as highlighterImports } from 'shiki/langs'
import { ref } from 'vue'
import {
  collectEmbeddedLangs,
  resolveShikiLanguageSource,
  withRegistryAlias,
} from '../lib/shiki/resolveGrammar'
import { useTheme } from './useTheme'

/** Always loaded for response / schema bodies (not the code-samples UI). */
const CORE_HIGHLIGHTERS: BundledLanguage[] = ['json', 'xml', 'markdown']

const FALLBACK_HTML = (content: string) => `<pre><code>${content}</code></pre>`

let shiki: HighlighterCore | null = null
let initPromise: Promise<void> | null = null
const languageLoadPromises = new Map<string, Promise<boolean>>()
/** In-flight registered-grammar resolves, shared across concurrent batch walks. */
const languageSourcePromises = new Map<string, Promise<LanguageRegistration[]>>()
const loading = ref(true)

async function resolveRegisteredGrammars(lang: string): Promise<LanguageRegistration[] | null> {
  const cached = languageSourcePromises.get(lang)
  if (cached) {
    return cached
  }

  const source = useTheme().getShikiLanguage(lang)
  if (!source) {
    return null
  }

  const pending = Promise.resolve(resolveShikiLanguageSource(source))
    .then(grammars => withRegistryAlias(grammars, lang) as LanguageRegistration[])
    .catch((error) => {
      // Drop only this attempt so a later ensureLanguage can retry the loader.
      if (languageSourcePromises.get(lang) === pending) {
        languageSourcePromises.delete(lang)
      }
      throw error
    })

  languageSourcePromises.set(lang, pending)
  return pending
}

async function importBundledLanguage(lang: BundledLanguage): Promise<LanguageRegistration[]> {
  const importer = highlighterImports[lang]
  if (!importer) {
    return []
  }

  try {
    const mod = await importer()
    return mod.default
  }
  catch {
    return []
  }
}

async function loadCoreLanguages(): Promise<LanguageRegistration[]> {
  const modules = await Promise.all(CORE_HIGHLIGHTERS.map(importBundledLanguage))
  return modules.flat()
}

async function createHighlighter(): Promise<HighlighterCore> {
  const themeConfig = useTheme()
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
  ])
  const highlighter = await createHighlighterCore({
    themes: [
      themeConfig.getHighlighterTheme()?.light,
      themeConfig.getHighlighterTheme()?.dark,
    ],
    langs: await loadCoreLanguages(),
    engine: createJavaScriptRegexEngine({
      target: 'ES2018',
    }),
  })

  if (!highlighter) {
    throw new Error('Failed to create Shiki highlighter')
  }

  return highlighter
}

function isLanguageReady(lang: string): boolean {
  return shiki?.getLoadedLanguages().includes(lang) ?? false
}

/**
 * Walk registered grammars (including circular embeds) into one batch, and
 * collect bundled embed ids that must be ensured before the batch load.
 * Cycles among registered grammars are handled by `batch.has(lang)`.
 */
async function collectRegisteredGrammarBatch(
  lang: string,
  batch: Map<string, LanguageRegistration[]>,
  bundledEmbeds: Set<string>,
): Promise<void> {
  if (batch.has(lang) || isLanguageReady(lang)) {
    return
  }

  const grammars = await resolveRegisteredGrammars(lang)
  if (!grammars) {
    return
  }

  batch.set(lang, grammars)

  for (const embeddedLang of collectEmbeddedLangs(grammars)) {
    if (isLanguageReady(embeddedLang)) {
      continue
    }

    if (useTheme().getShikiLanguage(embeddedLang)) {
      // Keep cyclic / nested registered grammars in the same loadLanguage call.
      await collectRegisteredGrammarBatch(embeddedLang, batch, bundledEmbeds)
      continue
    }

    bundledEmbeds.add(embeddedLang)
  }
}

async function loadRegisteredLanguage(lang: string): Promise<boolean> {
  if (!shiki) {
    return false
  }

  const batch = new Map<string, LanguageRegistration[]>()
  const bundledEmbeds = new Set<string>()

  try {
    await collectRegisteredGrammarBatch(lang, batch, bundledEmbeds)

    if (!batch.has(lang)) {
      return false
    }

    for (const embeddedLang of bundledEmbeds) {
      if (isLanguageReady(embeddedLang)) {
        continue
      }
      await ensureLanguage(embeddedLang)
    }

    // Register the whole registered subgraph together so circular embeds resolve.
    await shiki.loadLanguage([...batch.values()].flat())
    return isLanguageReady(lang)
  }
  finally {
    for (const key of batch.keys()) {
      languageSourcePromises.delete(key)
    }
  }
}

async function loadBundledLanguage(lang: string): Promise<boolean> {
  if (!shiki) {
    return false
  }

  const grammars = await importBundledLanguage(lang as BundledLanguage)
  if (grammars.length === 0) {
    console.warn(`Shiki language "${lang}" not available.`)
    return false
  }

  await shiki.loadLanguage(grammars)
  return true
}

async function loadLanguage(lang: string): Promise<boolean> {
  try {
    if (useTheme().getShikiLanguage(lang)) {
      return await loadRegisteredLanguage(lang)
    }
    return await loadBundledLanguage(lang)
  }
  catch (error) {
    console.error(`Failed to load Shiki language "${lang}":`, error)
    return false
  }
  finally {
    languageLoadPromises.delete(lang)
    languageSourcePromises.delete(lang)
  }
}

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

      shiki = await createHighlighter()
      loading.value = false
    }
    catch (error) {
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
  try {
    await init()
  }
  catch (error) {
    console.error('Failed to initialize Shiki:', error)
    return false
  }

  if (!shiki) {
    return false
  }

  if (isLanguageReady(lang)) {
    return true
  }

  const inFlight = languageLoadPromises.get(lang)
  if (inFlight) {
    return inFlight
  }

  const loadPromise = loadLanguage(lang)
  languageLoadPromises.set(lang, loadPromise)
  return loadPromise
}

export function useShiki() {
  function isReady(): boolean {
    return shiki !== null
  }

  function isLanguageLoaded(lang: string): boolean {
    return isLanguageReady(lang)
  }

  function renderShiki(content: string, { lang, theme }: { lang: string, theme: string }) {
    if (!shiki || !isLanguageReady(lang)) {
      return FALLBACK_HTML(content)
    }

    return shiki.codeToHtml(content, { lang, theme })
  }

  function reset() {
    shiki = null
    initPromise = null
    languageLoadPromises.clear()
    languageSourcePromises.clear()
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
