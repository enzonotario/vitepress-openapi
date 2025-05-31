import { theme, useOpenapi, useShiki } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' with {type: 'json'}
import ExampleBlock from './components/ExampleBlock.vue'
import SandboxIframe from './components/sandbox/SandboxIframe.vue'
import ScopeConfigurationTabs from './components/ScopeConfigurationTabs.vue'
import SlotDebugger from './components/SlotDebugger.vue'
import 'vitepress-openapi/dist/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    // Set the OpenAPI specification.
    useOpenapi({
      spec,
      config: {
        markdown: {
          operationLink: {
            transformHref: (href) => {
              return `/example${href}`
            },
          },
        },
      },
    })

    // Initialize Shiki for syntax highlighting.
    await useShiki().init()

    // Use the theme.
    theme.enhanceApp({ app })

    // Register custom components.
    app.component('ExampleBlock', ExampleBlock)
    app.component('SandboxIframe', SandboxIframe)
    app.component('ScopeConfigurationTabs', ScopeConfigurationTabs)
    app.component('SlotDebugger', SlotDebugger)
  },
}
