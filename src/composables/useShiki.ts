import { ref } from 'vue'
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki/core'
import { useTheme } from 'vitepress-openapi/composables/useTheme'
import type { Highlighter } from 'shiki/bundle/web'

import js from 'shiki/langs/javascript.mjs'
import ts from 'shiki/langs/typescript.mjs'
import markdown from 'shiki/langs/markdown.mjs'
import json from 'shiki/langs/json.mjs'
import xml from 'shiki/langs/xml.mjs'
import python from 'shiki/langs/python.mjs'
import bash from 'shiki/langs/bash.mjs'
import php from 'shiki/langs/php.mjs'

const langs = [js, ts, markdown, json, xml, python, bash, php]

let shiki: Highlighter | null = null

const loading = ref(true)
const themeConfig = useTheme()

export function useShiki() {
  const initShiki = () => {
    if (shiki) {
      return
    }
    shiki = createHighlighterCoreSync({
      themes: [themeConfig.getHighlighterTheme().light, themeConfig.getHighlighterTheme().dark],
      langs,
      engine: createJavaScriptRegexEngine(),
    })
  }

  const renderShiki = (content: string, { lang, theme }: { lang: string, theme: string }) => {
    if (shiki && shiki.getLoadedLanguages().includes(lang)) {
      const result = shiki.codeToHtml(content, {
        lang,
        theme,
      })
      return result
    } else {
      return `<pre><code>${content}</code></pre>`
    }
  }

  return { loading, renderShiki, initShiki }
}
