import { theme, useOpenapi, useTheme } from 'vitepress-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../../docs/public/openapi.json' assert {type: 'json'}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi({ spec })
    app.provide('openapi', openapi)

    // Configure the theme.
    const themeConfig = useTheme()
    themeConfig.setI18nConfig({
      locale: 'es',
    })

    // Use the theme.
    theme.enhanceApp({ app, openapi })
  },
}
