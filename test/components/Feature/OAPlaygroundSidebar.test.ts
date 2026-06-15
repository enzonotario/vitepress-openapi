import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import OAPlaygroundSidebar from '../../../src/components/Feature/OAPlaygroundSidebar.vue'
import { createOpenApiSpec } from '../../../src/lib/spec/createOpenApiSpec'
import { useTheme } from '../../../src/composables/useTheme'
import { spec } from '../../testsConstants'

const route = {
  path: '/example/playground',
}

const theme = ref<Record<string, any>>({})

vi.mock('vitepress', () => ({
  useData: () => ({
    theme,
  }),
  useRoute: () => route,
}))

vi.mock('../../../src/components/Feature/VPSidebarGroup.js', () => ({
  default: defineComponent({
    name: 'MockVPSidebarGroup',
    props: {
      items: {
        type: Array,
        required: true,
      },
    },
    template: '<pre data-test="sidebar-items">{{ JSON.stringify(items) }}</pre>',
  }),
}))

describe('OAPlaygroundSidebar', () => {
  const themeConfig = useTheme()
  const openapi = createOpenApiSpec({ spec })

  beforeEach(() => {
    themeConfig.reset()
    theme.value = {}
    route.path = '/example/playground'
  })

  it('uses the playground sidebar configured through the composable', async () => {
    themeConfig.setPlaygroundSidebar([
      {
        text: 'Composable',
        link: '/composable',
      },
    ])

    const app = createSSRApp(() => h(OAPlaygroundSidebar, { openapi }))
    const html = await renderToString(app)

    expect(html).toContain('Composable')
    expect(html).toContain('/composable')
  })

  it('uses the playground sidebar configured in the vitepress theme config', async () => {
    theme.value = {
      playgroundSidebar: {
        '/example/': [
          {
            text: 'Theme Config',
            link: '/theme-config',
          },
        ],
      },
    }

    const app = createSSRApp(() => h(OAPlaygroundSidebar, { openapi }))
    const html = await renderToString(app)

    expect(html).toContain('Theme Config')
    expect(html).toContain('/theme-config')
  })

  it('prefers the composable sidebar over the vitepress theme config', async () => {
    themeConfig.setPlaygroundSidebar([
      {
        text: 'Composable',
        link: '/composable',
      },
    ])

    theme.value = {
      playgroundSidebar: [
        {
          text: 'Theme Config',
          link: '/theme-config',
        },
      ],
    }

    const app = createSSRApp(() => h(OAPlaygroundSidebar, { openapi }))
    const html = await renderToString(app)

    expect(html).toContain('Composable')
    expect(html).not.toContain('Theme Config')
  })
})
