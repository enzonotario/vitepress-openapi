import type { HighlighterCore } from 'shiki/core'
import bash from '@shikijs/langs/bash'
import js from '@shikijs/langs/javascript'
import json from '@shikijs/langs/json'
import markdown from '@shikijs/langs/markdown'
import php from '@shikijs/langs/php'
import python from '@shikijs/langs/python'
import ts from '@shikijs/langs/typescript'
import xml from '@shikijs/langs/xml'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { ref } from 'vue'
import { useTheme } from './useTheme'

const langs = [js, ts, markdown, json, xml, python, bash, php]

let shiki: HighlighterCore | null = null

const loading = ref(true)
const themeConfig = useTheme()

export function useShiki() {
  async function init() {
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
    init,
    initShiki: async () => {
      console.warn('initShiki is deprecated, use init instead')
      await init()
    },
  }
}
