import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import OASpecPlaygroundContent from '../../../src/components/Feature/OASpecPlaygroundContent.vue'

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

describe('OASpecPlaygroundContent', () => {
  it('renders the default playground content without an internal sidebar', async () => {
    const app = createSSRApp(() => h(OASpecPlaygroundContent, { openapi: {} }))

    app.config.globalProperties.$t = (value: string) => value

    const html = await renderToString(app)

    expect(html).toContain('class="flex flex-col space-y-4"')
    expect(html).toContain('Select an operation to try it out')
    expect(html).not.toContain('class="OAContent"')
    expect(html).not.toContain('class="OADoc"')
  })

  it('renders a custom playground slot when provided', async () => {
    const app = createSSRApp({
      render() {
        return h(OASpecPlaygroundContent, { openapi: {} }, {
          playground: () => h('div', { 'data-test': 'custom-playground' }),
        })
      },
    })

    const html = await renderToString(app)

    expect(html).toContain('data-test="custom-playground"')
    expect(html).not.toContain('class="OAContent"')
  })
})
