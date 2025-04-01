import type { Awaitable } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress/client'
import type { Component } from 'vue'
import type { OpenApi } from './lib/OpenApi'
import { createI18n } from '@byjohann/vue-i18n'
import { watch } from 'vue'
import * as components from './components'
import { DEFAULT_OPERATION_SLOTS, useTheme } from './composables/useTheme'

interface OAEnhanceAppContext extends EnhanceAppContext {
  openapi?: ReturnType<typeof OpenApi> | null
}

interface VPTheme {
  Layout: Component
  enhanceApp: (ctx: OAEnhanceAppContext) => Awaitable<void>
  extends?: Theme
}

export const theme = {
  enhanceApp({ app }) {
    const themeConfig = useTheme()

    const i18nConfig = themeConfig.getI18nConfig()

    const i18n = createI18n({
      defaultLocale: i18nConfig.locale.value,
      messages: i18nConfig.messages,
    })

    app.use(i18n)

    watch(
      () => themeConfig.getLocale(),
      () => {
        i18n.setLocale(themeConfig.getLocale())
      },
      {
        immediate: true,
      },
    )

    Object.entries(components).forEach(([key, component]) => {
      app.component(key, component)
    })
  },
} as VPTheme

export { useOpenapi } from './composables/useOpenapi'
export { usePlayground } from './composables/usePlayground'
export { DEFAULT_OPERATION_SLOTS }
export { useShiki } from './composables/useShiki'
export { useTheme } from './composables/useTheme'
export { generateCodeSample } from './lib/codeSamples/generateCodeSample'
export { OARequest } from './lib/codeSamples/request'
export { OpenApi } from './lib/OpenApi'
export { locales } from './locales'
