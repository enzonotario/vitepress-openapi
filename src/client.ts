import type { Awaitable } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress/client'
import type { Component } from 'vue'
import type { OpenApi } from './lib/OpenApi'
import { watch } from 'vue'
import * as VueI18n from 'vue-i18n'
import * as components from './components'
import { useShiki } from './composables/useShiki'
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
    const i18n: any = VueI18n.createI18n({
      legacy: false,
      locale: i18nConfig.locale.value,
      fallbackLocale: i18nConfig.fallbackLocale.value,
      messages: i18nConfig.messages,
    })
    app.use(i18n)

    watch(
      () => themeConfig.getLocale(),
      () => {
        if (i18n.global.locale.value !== themeConfig.getLocale()) {
          i18n.global.locale.value = themeConfig.getLocale()
        }
      },
      {
        immediate: true,
      },
    )

    Object.entries(components).forEach(([key, component]) => {
      app.component(key, component)
    })

    useShiki().initShiki()
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
