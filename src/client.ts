import type { Awaitable } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress/client'
import type { Component } from 'vue'
import type { OpenApiSpecInstance } from './lib/spec/createOpenApiSpec'
import { useData } from 'vitepress'
import { setIsDarkSource } from './composables/useTheme'
import { VitepressOpenapi } from './vue'

interface OAEnhanceAppContext extends EnhanceAppContext {
  openapi?: OpenApiSpecInstance | null
}

interface VPTheme {
  Layout: Component
  enhanceApp: (ctx: OAEnhanceAppContext) => Awaitable<void>
  extends?: Theme
}

export const theme = {
  enhanceApp({ app }) {
    // Follow VitePress' resolved appearance, including 'force-dark' and 'force-auto'.
    try {
      setIsDarkSource(app.runWithContext(() => useData()).isDark)
    }
    catch {
      // Not inside a VitePress app: keep the useDark fallback.
    }

    // VitePress already handles the copy buttons of code blocks.
    app.use(VitepressOpenapi, { copyCode: false })
  },
} as VPTheme

// Everything that does not depend on VitePress lives in `vitepress-openapi/vue`.
export * from './vue'
