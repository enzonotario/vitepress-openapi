import { ref } from 'vue'
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki/core'
import js from 'shiki/langs/javascript.mjs'
import ts from 'shiki/langs/typescript.mjs'
import markdown from 'shiki/langs/markdown.mjs'
import json from 'shiki/langs/json.mjs'
import xml from 'shiki/langs/xml.mjs'
import python from 'shiki/langs/python.mjs'
import bash from 'shiki/langs/bash.mjs'
import php from 'shiki/langs/php.mjs'
import type { HighlighterCore } from '@shikijs/core/types'
import { useTheme } from './useTheme'

const langs = [js, ts, markdown, json, xml, python, bash, php]

let shiki: HighlighterCore | null = null

const loading = ref(true)
const themeConfig = useTheme()

export function useShiki() {
  const initShiki = () => {
    if (shiki) {
      return
    }
    shiki = createHighlighterCoreSync({
      themes: [themeConfig.getHighlighterTheme()?.light, themeConfig.getHighlighterTheme()?.dark],
      langs,
      engine: createJavaScriptRegexEngine(),
    })
  }

  const renderShiki = (content: string, { lang, theme }: { lang: string, theme: string }) => {
    if (shiki && shiki.getLoadedLanguages().includes(lang)) {
      return shiki.codeToHtml(content, {
        lang,
        theme,
      })
    } else {
      return `<pre><code>${content}</code></pre>`
    }
  }

  return { loading, renderShiki, initShiki }
}
