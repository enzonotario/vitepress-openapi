import { locales, theme, useOpenapi, useTheme } from 'vitepress-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' assert {type: 'json'}
import 'vitepress-openapi/dist/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi()
    openapi.setSpec(spec)

    // Optionally, set the i18n configuration.
    const themeConfig = useTheme()
    themeConfig.setI18nConfig({
      messages: {
        en: {
          ...locales.en,
          'operation.badgePrefix.operationId': 'Operation ID: ',
        },
        es: {
          ...locales.es,
          'operation.badgePrefix.operationId': 'ID de operación: ',
        },
      },
    })

    // Use the theme.
    theme.enhanceApp({ app })
  },
}
