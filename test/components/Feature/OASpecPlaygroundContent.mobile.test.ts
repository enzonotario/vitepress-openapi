import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import OASpecPlaygroundContent from '../../../src/components/Feature/OASpecPlaygroundContent.vue'

vi.mock('vitepress', () => ({
  useData: () => ({
    hash: ref(''),
  }),
}))

vi.mock('../../../src/lib/playgroundData', () => ({
  usePlaygroundData: () => ({
    selectedOperation: ref(null),
  }),
}))

vi.mock('../../../src/components/Common/OAFooter.vue', () => ({
  default: defineComponent({
    name: 'MockOAFooter',
    template: '<div data-test="footer" />',
  }),
}))

vi.mock('../../../src/components/Feature/OAOperationPlayground.vue', () => ({
  default: defineComponent({
    name: 'MockOAOperationPlayground',
    template: '<div data-test="operation-playground" />',
  }),
}))

vi.mock('../../../src/components/Feature/OAPlaygroundSidebar.vue', () => ({
  default: defineComponent({
    name: 'MockOAPlaygroundSidebar',
    template: '<div data-test="default-sidebar" />',
  }),
}))

describe('OASpecPlaygroundContent', () => {
  it('wraps a custom sidebar slot in the managed sidebar shell and passes the mobile state', async () => {
    let receivedSidebarOpen: boolean | undefined

    const app = createSSRApp({
      render() {
        return h(OASpecPlaygroundContent, { openapi: {} }, {
          sidebar: ({ sidebarOpen }: { sidebarOpen?: boolean }) => {
            receivedSidebarOpen = sidebarOpen

            return h('div', {
              'data-test': 'custom-sidebar',
              'data-open': String(sidebarOpen),
            })
          },
        })
      },
    })

    app.config.globalProperties.$t = (value: string) => value

    const html = await renderToString(app)

    expect(html).toContain('class="OASidebar"')
    expect(html).toContain('data-test="custom-sidebar"')
    expect(html).toContain('data-open="false"')
    expect(receivedSidebarOpen).toBe(false)
  })
})
