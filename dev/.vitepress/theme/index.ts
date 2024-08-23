import { theme, useOpenapi, useTheme } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' assert {type: 'json'}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi()
    openapi.setSpec(spec)

    // Setup Theme
    const themeConfig = useTheme()
    themeConfig.setLocale('es')

    // Use the theme.
    theme.enhanceApp({ app })
  },
}
