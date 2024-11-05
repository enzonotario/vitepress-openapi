import { theme, useOpenapi } from 'vitepress-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../../docs/public/openapi.json' assert {type: 'json'}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi({
      spec,
      config: {
        i18n: {
          locale: 'es',
        },
      },
    })

    // Use the theme.
    theme.enhanceApp({ app, openapi })
  },
}
