import type { HighlighterCore, LanguageRegistration } from 'shiki/core'
import type { BundledLanguage } from 'shiki/langs'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
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
const loading = ref(true)

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

async function loadRegisteredLanguage(lang: string, chain: Set<string>): Promise<boolean> {
  if (!shiki) {
    return false
  }

  const source = useTheme().getShikiLanguage(lang)
  if (!source) {
    return false
  }

  const grammars = withRegistryAlias(await resolveShikiLanguageSource(source), lang)

  for (const embeddedLang of collectEmbeddedLangs(grammars)) {
    // Skip ready langs and the current dependency chain (circular embeds).
    // Unrelated in-flight loads are awaited via ensureLanguageWithChain.
    if (isLanguageReady(embeddedLang) || chain.has(embeddedLang)) {
      continue
    }
    await ensureLanguageWithChain(embeddedLang, chain)
  }

  await shiki.loadLanguage(grammars as LanguageRegistration[])
  return isLanguageReady(lang)
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

async function loadLanguage(lang: string, chain: Set<string>): Promise<boolean> {
  try {
    if (useTheme().getShikiLanguage(lang)) {
      return await loadRegisteredLanguage(lang, chain)
    }
    return await loadBundledLanguage(lang)
  }
  catch (error) {
    console.error(`Failed to load Shiki language "${lang}":`, error)
    return false
  }
  finally {
    languageLoadPromises.delete(lang)
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
  return ensureLanguageWithChain(lang, new Set())
}

/**
 * Like ensureLanguage, but `chain` tracks ancestors in the current embed walk
 * so circular grammars do not self-await. Unrelated in-flight loads are still awaited.
 */
async function ensureLanguageWithChain(lang: string, chain: Set<string>): Promise<boolean> {
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

  // Already loading in this dependency walk — do not await our own promise.
  if (chain.has(lang)) {
    return false
  }

  const inFlight = languageLoadPromises.get(lang)
  if (inFlight) {
    return inFlight
  }

  const nextChain = new Set(chain)
  nextChain.add(lang)

  const loadPromise = loadLanguage(lang, nextChain)
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
