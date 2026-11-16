import { beforeEach, describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import OAMarkdown from '../../../src/components/Common/OAMarkdown.vue'
import { useTheme } from '../../../src/composables/useTheme'

function renderMarkdown(content: string) {
  return renderToString(createSSRApp({ render: () => h(OAMarkdown, { content }) }))
}

describe('oAMarkdown', () => {
  beforeEach(() => {
    useTheme().reset()
  })

  it('sanitizes HTML in server-rendered descriptions', async () => {
    const html = await renderMarkdown('API description. <img src=x onerror="document.title=\'PWNED-XSS\'">')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('PWNED-XSS')
    expect(html).toContain('<p>API description. <img src="x"></p>')
  })

  it('keeps legitimate HTML in server-rendered descriptions', async () => {
    const html = await renderMarkdown('**Note**<br><details><summary>More</summary>Text</details>')
    expect(html).toContain('<strong>Note</strong><br><details><summary>More</summary>Text</details>')
  })
})
