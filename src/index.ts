import * as VueI18n from 'vue-i18n'
import type { EnhanceAppContext, Theme } from 'vitepress/client'
import type { Component } from 'vue'
import type { Awaitable } from 'vitepress'
import { useTheme } from './composables/useTheme'
import { useShiki } from './composables/useShiki'
import * as components from './components'

import 'tailwindcss/tailwind.css'
import './style.css'
import './json.css'

export { useSidebar } from './composables/useSidebar'
export { useOpenapi } from './composables/useOpenapi'
export { useTheme } from './composables/useTheme'
export { useShiki } from './composables/useShiki'
export { usePlayground } from './composables/usePlayground'
export { OpenApi } from './lib/OpenApi'
export { locales } from './locales'

interface VPTheme {
  Layout: Component
  enhanceApp: (ctx: EnhanceAppContext) => Awaitable<void>
  extends?: Theme
}

export const theme = {
  enhanceApp({ app }) {
    const themeConfig = useTheme()

    const i18n = VueI18n.createI18n({
      locale: themeConfig.getI18nConfig().locale,
      fallbackLocale: themeConfig.getI18nConfig().fallbackLocale,
      messages: themeConfig.getI18nConfig().messages,
    })
    app.use(i18n)

    for (const key in components) {
      // @ts-expect-error: no index signature
      app.component(key, components[key])
    }

    useShiki().initShiki()
  },
} as VPTheme

export const httpVerbs = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']
