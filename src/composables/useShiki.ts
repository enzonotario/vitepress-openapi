import type { HighlighterCore } from 'shiki/core'
import bash from '@shikijs/langs-precompiled/bash'
import js from '@shikijs/langs-precompiled/javascript'
import json from '@shikijs/langs-precompiled/json'
import markdown from '@shikijs/langs-precompiled/markdown'
import php from '@shikijs/langs-precompiled/php'
import python from '@shikijs/langs-precompiled/python'
import ts from '@shikijs/langs-precompiled/typescript'
import xml from '@shikijs/langs-precompiled/xml'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
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
    shiki = await createHighlighterCore({
      themes: [
        themeConfig.getHighlighterTheme()?.light,
        themeConfig.getHighlighterTheme()?.dark,
      ],
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
