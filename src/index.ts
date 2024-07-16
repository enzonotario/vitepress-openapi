import 'tailwindcss/tailwind.css'
import './style.css'
import * as VueI18n from 'vue-i18n'
import type { EnhanceAppContext, Theme } from 'vitepress/client'
import type { Component } from 'vue'
import type { Awaitable } from 'vitepress'
import * as components from './components'
import es from './locales/es.json'
import en from './locales/en.json'

export { useSidebar } from './composables/useSidebar'
export { useOpenapi } from './composables/useOpenapi'

interface VPTheme {
  Layout: Component
  enhanceApp: (ctx: EnhanceAppContext) => Awaitable<void>
  extends?: Theme
}

export const theme = {
  enhanceApp({ app, router, siteData }) {
    const i18n = VueI18n.createI18n({
      locale: 'es',
      fallbackLocale: 'en',
      messages: {
        en,
        es,
      },
    })
    app.use(i18n)

    for (const key in components) {
      app.component(key, components[key])
    }
  },
} as VPTheme
