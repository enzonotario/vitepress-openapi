import type { HighlighterCore } from 'shiki'
import { createHighlighter } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import bash from 'shiki/langs/bash.mjs'
import js from 'shiki/langs/javascript.mjs'
import json from 'shiki/langs/json.mjs'
import markdown from 'shiki/langs/markdown.mjs'
import php from 'shiki/langs/php.mjs'
import python from 'shiki/langs/python.mjs'
import ts from 'shiki/langs/typescript.mjs'
import xml from 'shiki/langs/xml.mjs'
import { ref } from 'vue'
import { useTheme } from './useTheme'

const langs = [js, ts, markdown, json, xml, python, bash, php]

let shiki: HighlighterCore | null = null

const loading = ref(true)
const themeConfig = useTheme()

export function useShiki() {
  async function initShiki() {
    if (shiki) {
      return
    }
    shiki = await createHighlighter({
      themes: [themeConfig.getHighlighterTheme()?.light, themeConfig.getHighlighterTheme()?.dark],
      langs,
      engine: createJavaScriptRegexEngine(),
    })
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

  return {
    loading,
    renderShiki,
    initShiki,
  }
}
