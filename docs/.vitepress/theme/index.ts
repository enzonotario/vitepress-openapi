import { theme, useOpenapi, useTheme } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' assert {type: 'json'}
import 'vitepress-theme-openapi/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi()
    openapi.setSpec(spec)

    // Use the theme.
    theme.enhanceApp({ app })
  },
}
