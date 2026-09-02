/// <reference types="vite/client" />

declare module 'markdown-it-link-attributes' {
  import type { MarkdownIt } from 'markdown-it'

  interface LinkAttributesConfig {
    matcher: (href: string) => boolean
    attrs: Record<string, string>
  }

  type LinkAttributesPlugin = (
    md: MarkdownIt,
    configs: LinkAttributesConfig | LinkAttributesConfig[],
  ) => void

  const plugin: LinkAttributesPlugin
  export default plugin
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line ts/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}
