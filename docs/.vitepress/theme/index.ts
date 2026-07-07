import { theme, useOpenapi } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import spec from '../../public/openapi.json' with { type: 'json' }
import ExampleBlock from './components/ExampleBlock.vue'
import PlaygroundSpecSelect from './components/playground/PlaygroundSpecSelect.vue'
import SandboxIframe from './components/sandbox/SandboxIframe.vue'
import ScopeConfigurationTabs from './components/ScopeConfigurationTabs.vue'
import SlotDebugger from './components/SlotDebugger.vue'
import 'vitepress-openapi/dist/style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(PlaygroundSpecSelect),
      'nav-screen-content-before': () => h(PlaygroundSpecSelect, { mobile: true }),
    })
  },
  enhanceApp({ app }) {
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

    // Use the theme.
    theme.enhanceApp({ app })

    // Register custom components.
    app.component('ExampleBlock', ExampleBlock)
    app.component('SandboxIframe', SandboxIframe)
    app.component('ScopeConfigurationTabs', ScopeConfigurationTabs)
    app.component('SlotDebugger', SlotDebugger)
  },
}
