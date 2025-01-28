import type { Theme } from 'vitepress'
import spec from '@public/openapi.json'

import { theme, useOpenapi } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import 'vitepress-openapi/dist/style.css'

export default {
  ...DefaultTheme,
  async enhanceApp({ app, router, siteData }) {
    const openapi = useOpenapi({
      spec,
      config: {},
    })

    theme.enhanceApp({ app, openapi })
  },
} satisfies Theme
