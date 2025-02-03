import { theme, useOpenapi } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' with {type: 'json'}
import ExampleBlock from './components/ExampleBlock.vue'
import SandboxIframe from './components/sandbox/SandboxIframe.vue'
import 'vitepress-openapi/dist/style.css'
import './style.css'

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
    app.component('SandboxIframe', SandboxIframe)
  },
}
