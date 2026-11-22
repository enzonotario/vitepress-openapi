import type { Theme } from 'vitepress'
import { theme, useOpenapi } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import spec from '../../openapi.json'
import 'vitepress-openapi/dist/style.css'

export default {
  extends: DefaultTheme,
  async enhanceApp(ctx) {
    useOpenapi({ spec })
    theme.enhanceApp(ctx)
  },
} satisfies Theme
