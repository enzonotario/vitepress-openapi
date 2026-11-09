import type { PartialUseThemeConfig } from 'vitepress-openapi/vue'

// Same as the docs: operation links in descriptions point to the example pages.
export const baseConfig: PartialUseThemeConfig = {
  markdown: {
    operationLink: {
      transformHref: href => `/example${href}`,
    },
  },
}
