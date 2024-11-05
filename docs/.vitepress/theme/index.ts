import { theme, useOpenapi } from 'vitepress-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' assert {type: 'json'}
import 'vitepress-openapi/dist/style.css'
import ExampleBlock from '@dev/.vitepress/theme/components/ExampleBlock.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Set the OpenAPI specification.
    const openapi = useOpenapi({
      spec,
    })

    // Use the theme.
    theme.enhanceApp({ app, openapi })

    // Register custom components.
    app.component('ExampleBlock', ExampleBlock)
  },
}
