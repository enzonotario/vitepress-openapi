import * as VueI18n from 'vue-i18n'
import type { EnhanceAppContext, Theme } from 'vitepress/client'
import type { Component } from 'vue'
import type { Awaitable } from 'vitepress'
import { DEFAULT_OPERATION_SLOTS, useTheme } from './composables/useTheme'
import { useShiki } from './composables/useShiki'
import * as components from './components'

import type { createOpenApiInstance } from './lib/createOpenApiInstance'

import 'tailwindcss/tailwind.css'
import './style.css'
import './json.css'

export { DEFAULT_OPERATION_SLOTS }
export { useSidebar } from './composables/useSidebar'
export { useOpenapi } from './composables/useOpenapi'
export { useTheme } from './composables/useTheme'
export { useShiki } from './composables/useShiki'
export { usePlayground } from './composables/usePlayground'
export { usePaths } from './composables/usePaths'
export { OpenApi } from './lib/OpenApi'
export { getOpenApiInstance } from './lib/getOpenApiInstance'
export { createOpenApiInstance } from './lib/createOpenApiInstance'
export { OARequest } from './lib/codeSamples/request'
export type { IOARequest } from './lib/codeSamples/request'
export { generateCodeSample } from './lib/codeSamples/generateCodeSample'
export { locales } from './locales'

interface OAEnhanceAppContext extends EnhanceAppContext {
  openapi: ReturnType<typeof createOpenApiInstance>
}

interface VPTheme {
  Layout: Component
  enhanceApp: (ctx: OAEnhanceAppContext) => Awaitable<void>
  extends?: Theme
}

export const theme = {
  enhanceApp({ app, openapi }) {
    if (openapi) {
      app.provide('openapi', openapi)
    }

    const themeConfig = useTheme()

    const i18n: any = VueI18n.createI18n({
      legacy: false,
      locale: themeConfig.getI18nConfig().locale.value,
      fallbackLocale: themeConfig.getI18nConfig().fallbackLocale.value,
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

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']
