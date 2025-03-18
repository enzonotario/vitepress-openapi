import { theme, useOpenapi } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' with {type: 'json'}
import ExampleBlock from './components/ExampleBlock.vue'
import SandboxIframe from './components/sandbox/SandboxIframe.vue'
import ScopeConfigurationTabs from './components/ScopeConfigurationTabs.vue'
import 'vitepress-openapi/dist/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    // Set the OpenAPI specification.
    await useOpenapi().async({
      spec,
    })

    // Use the theme.
    theme.enhanceApp({ app })

    // Register custom components.
    app.component('ExampleBlock', ExampleBlock)
    app.component('SandboxIframe', SandboxIframe)
    app.component('ScopeConfigurationTabs', ScopeConfigurationTabs)
  },
}
