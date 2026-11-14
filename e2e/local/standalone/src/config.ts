import type { PartialUseThemeConfig } from 'v-openapi'
import { withBase } from './base'

// Same as the docs: operation links in descriptions point to the example pages.
export const baseConfig: PartialUseThemeConfig = {
  markdown: {
    operationLink: {
      transformHref: href => withBase(`/example${href}`),
    },
  },
}
