import { theme, useOpenapi } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' assert {type: 'json'}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    useOpenapi({ spec })
    theme.enhanceApp({ app })
  },
}
