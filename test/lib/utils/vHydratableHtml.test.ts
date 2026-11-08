import { describe, expect, it } from 'vitest'
import { createSSRApp, h, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { vHydratableHtml } from '../../../src/lib/utils/vHydratableHtml'

function fakeElement(innerHTML = '') {
  let writes = 0
  let html = innerHTML
  const el = {
    get innerHTML() {
      return html
    },
    set innerHTML(value: string) {
      writes++
      html = value
    },
    hasChildNodes: () => html !== '',
    get writes() {
      return writes
    },
  }
  return el as typeof el & { _oaHtml?: string }
}

const binding = (value: string) => ({ value }) as any

describe('vHydratableHtml', () => {
  it('renders the HTML on the server', async () => {
    const app = createSSRApp({
      render: () => withDirectives(h('div', { class: 'md' }), [[vHydratableHtml, '<p>Hello</p>']]),
    })
    expect(await renderToString(app)).toBe('<div class="md"><p>Hello</p></div>')
  })

  it('keeps server-rendered nodes while hydrating', () => {
    const el = fakeElement('<p>Hello</p>')
    vHydratableHtml.beforeMount!(el as any, binding('<p>Hello</p>'), null as any, null)
    expect(el.writes).toBe(0)
  })

  it('writes the HTML on a client-side mount', () => {
    const el = fakeElement()
    vHydratableHtml.beforeMount!(el as any, binding('<p>Hello</p>'), null as any, null)
    expect(el.innerHTML).toBe('<p>Hello</p>')
  })

  it('writes only when the value changes', () => {
    const el = fakeElement('<p>Hello</p>')
    vHydratableHtml.beforeMount!(el as any, binding('<p>Hello</p>'), null as any, null)

    vHydratableHtml.updated!(el as any, binding('<p>Hello</p>'), null as any, null as any)
    expect(el.writes).toBe(0)

    vHydratableHtml.updated!(el as any, binding('<p>Bye</p>'), null as any, null as any)
    expect(el.writes).toBe(1)
    expect(el.innerHTML).toBe('<p>Bye</p>')
  })
})
