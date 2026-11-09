import type { App, Plugin } from 'vue'
import type { PartialUseThemeConfig } from './composables/useTheme'
import type { OpenAPIDocument } from './types'
import { createI18n } from '@byjohann/vue-i18n'
import { watch } from 'vue'
import * as components from './components'
import { useOpenapi } from './composables/useOpenapi'
import { DEFAULT_OPERATION_SLOTS, useTheme } from './composables/useTheme'
import { setupCopyCode } from './lib/utils/copyCode'

export interface VitepressOpenapiOptions {
  /** OpenAPI document (object, or a JSON/YAML string) used by components without their own `spec`. */
  spec?: OpenAPIDocument | string
  /** Theme configuration, the same as `useTheme(config)`. */
  config?: PartialUseThemeConfig
  /** Handle the copy buttons of code blocks. VitePress already does it, so its theme disables this. Default: true. */
  copyCode?: boolean
}

/**
 * Vue plugin to use the components in any Vue 3 app, without VitePress.
 * It installs i18n and registers the components globally.
 */
export const VitepressOpenapi: Plugin<[VitepressOpenapiOptions?]> = {
  install(app: App, options: VitepressOpenapiOptions = {}) {
    if (options.spec || options.config) {
      useOpenapi(options)
    }

    if (options.copyCode !== false) {
      setupCopyCode()
    }

    const themeConfig = useTheme()

    const i18nConfig = themeConfig.getI18nConfig()

    const i18n = createI18n({
      defaultLocale: i18nConfig.locale?.value || 'en',
      messages: i18nConfig.messages || {},
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
}

export * from './components'
export { useOpenapi } from './composables/useOpenapi'
export { usePlayground } from './composables/usePlayground'
export { DEFAULT_OPERATION_SLOTS }
export { useShiki } from './composables/useShiki'
export { type SidebarItem, useSidebar } from './composables/useSidebar'
export { type PartialUseThemeConfig, useTheme } from './composables/useTheme'
export { generateCodeSample } from './lib/codeSamples/generateCodeSample'
export { OARequest } from './lib/codeSamples/request'
export { createOpenApiSpec } from './lib/spec/createOpenApiSpec'
export { minifyHtml } from './lib/utils/minifyHtml'
export { locales } from './locales'
