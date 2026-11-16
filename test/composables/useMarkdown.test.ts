import type { MarkdownIt } from 'markdown-it'
import MarkdownItClass from 'markdown-it'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMarkdown } from '../../src/composables/useMarkdown'
import { useOpenapi } from '../../src/composables/useOpenapi'
import { useTheme } from '../../src/composables/useTheme'
import { spec } from '../testsConstants'

describe('useMarkdown', () => {
  it('should return a markdown-it instance', () => {
    const { md } = useMarkdown()
    expect(md).toBeDefined()
    expect(typeof md.render).toBe('function')
  })

  it('should render markdown content', () => {
    const { render } = useMarkdown()
    const content = '# Hello World'
    const result = render(content)
    expect(result).toContain('<h1>Hello World</h1>')
  })

  it('should handle empty content', () => {
    const { render } = useMarkdown()
    const result = render('')
    expect(result).toBe('')
  })

  it('should handle undefined content', () => {
    const { render } = useMarkdown()
    const result = render(undefined)
    expect(result).toBe('')
  })

  it('adds target="_blank" to external links when configured', () => {
    const theme = useTheme()
    theme.setMarkdownConfig({ externalLinksNewTab: true })
    const { render } = useMarkdown()
    const result = render('[link](https://example.com)')
    expect(result).toContain('target="_blank"')
  })

  it('does not transform operation links when disabled', () => {
    const theme = useTheme()
    theme.reset()
    theme.setMarkdownConfig({ operationLink: false })
    useOpenapi({ spec })
    const { render } = useMarkdown()
    const result = render('[Get Users](/operations/getUsers)')
    expect(result).toContain('<a href="/operations/getUsers">Get Users</a>')
    expect(result).not.toContain('OAOperationLink')
  })

  it('calls config function from markdown config', () => {
    const theme = useTheme()
    theme.reset()
    const configFn = vi.fn((md: MarkdownIt) => md)
    theme.setMarkdownConfig({ config: configFn })
    useMarkdown()
    expect(configFn).toHaveBeenCalled()
  })
})

describe('useMarkdown sanitization', () => {
  beforeEach(() => {
    useTheme().reset()
  })

  function render(content: string) {
    return useMarkdown().render(content)
  }

  it('removes event handler attributes from raw HTML', () => {
    const result = render('API description. <img src=x onerror="document.title=\'PWNED-XSS\'">')
    expect(result).not.toContain('onerror')
    expect(result).not.toContain('PWNED-XSS')
    expect(result).toContain('<img src="x">')
  })

  it('removes script tags and their content', () => {
    const result = render('Before\n\n<script>alert(1)</script>\n\nAfter <script>alert(2)</script>')
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert(')
    expect(result).toContain('Before')
    expect(result).toContain('After')
  })

  it('removes svg event handlers', () => {
    const result = render('<svg onload="alert(1)"><circle r="1" /></svg>')
    expect(result).not.toContain('onload')
    expect(result).not.toContain('<svg')
  })

  it('removes iframes, objects, embeds, forms and style tags', () => {
    const result = render('<iframe src="https://example.com"></iframe><object data="x"></object><embed src="x"><form action="x"><input type="text"></form><style>body{display:none}</style>')
    for (const tag of ['<iframe', '<object', '<embed', '<form', '<style', 'display:none']) {
      expect(result).not.toContain(tag)
    }
  })

  it('removes javascript: URLs from raw HTML links', () => {
    const result = render('<a href="javascript:alert(1)">a</a> <a href="JaVaScRiPt&#58;alert(1)">b</a> <a href="java\tscript:alert(1)">c</a>')
    expect(result.toLowerCase()).not.toContain('javascript')
    expect(result).not.toContain('alert(')
  })

  it('removes javascript: URLs from Markdown links', () => {
    const result = render('[click](javascript:alert(1)) [click](<javascript:alert(1)>)')
    expect(result).not.toContain('href="javascript')
  })

  it('preserves legitimate HTML', () => {
    expect(render('line one<br>line two')).toContain('<br>')
    expect(render('<b>bold</b> and <i>italic</i>')).toContain('<b>bold</b> and <i>italic</i>')

    const details = render('<details>\n<summary>More</summary>\n\nHidden content\n\n</details>')
    expect(details).toContain('<details>')
    expect(details).toContain('<summary>More</summary>')
    expect(details).toContain('Hidden content')

    const table = render('<table><thead><tr><th>Name</th></tr></thead><tbody><tr><td colspan="2">Value</td></tr></tbody></table>')
    expect(table).toBe('<table><thead><tr><th>Name</th></tr></thead><tbody><tr><td colspan="2">Value</td></tr></tbody></table>')

    const classed = render('<span class="badge" id="x" title="t" data-kind="info" aria-label="Info" style="color:red">x</span>')
    expect(classed).toContain('<span class="badge" id="x" title="t" data-kind="info" aria-label="Info" style="color:red;">x</span>')
  })

  it('preserves Markdown output', () => {
    const markdown = [
      '# Title',
      '',
      '**bold** _em_ ~~del~~ `code`',
      '',
      '1. one',
      '2. two',
      '',
      '| a | b |',
      '|:--|--:|',
      '| 1 | 2 |',
      '',
      '> quote',
      '',
      '[relative](users/list?page=2) [root](/guide) [hash](#section) [mail](mailto:a@b.c)',
      '',
      '![image](https://example.com/a.png "Title")',
    ].join('\n')
    const result = render(markdown)
    const unsanitized = (() => {
      useTheme().setMarkdownConfig({ sanitize: false })
      return render(markdown)
    })()
    // The CSS filter only normalizes inline styles by appending a trailing `;`.
    expect(result).toBe(unsanitized.replaceAll(/style="([^"]*)"/g, 'style="$1;"'))
  })

  it('preserves code block language classes', () => {
    const result = render('```js\nconst a = 1 < 2\n```')
    expect(result).toContain('<pre><code class="language-js">const a = 1 &lt; 2\n</code></pre>')
  })

  it('preserves external link target and rel', () => {
    useTheme().setMarkdownConfig({ externalLinksNewTab: true })
    const result = render('[link](https://example.com)')
    expect(result).toContain('<a href="https://example.com" target="_blank" rel="noopener">link</a>')
  })

  it('preserves operation links', () => {
    useOpenapi({ spec })
    const result = render('[Get Users](/operations/getUsers)')
    expect(result).toContain('<a href="/operations/getUsers" class="OAOperationLink group/oaOperationLink"><span class="OAOperationLink-badge OAMethodBadge--get">GET</span><span class="OAOperationLink-title">Get Users</span></a>')
  })

  it('sanitizes the output of an instance returned by config', () => {
    useTheme().setMarkdownConfig({
      config: () => new MarkdownItClass({ html: true }),
    })
    const result = render('<img src=x onerror="alert(1)">')
    expect(result).not.toContain('onerror')
  })

  it('keeps raw HTML when sanitize is false', () => {
    useTheme().setMarkdownConfig({ sanitize: false })
    const result = render('<img src=x onerror="alert(1)">')
    expect(result).toContain('onerror="alert(1)"')
  })

  it('uses a custom sanitize function', () => {
    const sanitize = vi.fn((html: string) => html.replace('onerror', 'data-removed'))
    useTheme().setMarkdownConfig({ sanitize })
    const result = render('<img src=x onerror="alert(1)">')
    expect(sanitize).toHaveBeenCalledOnce()
    expect(result).toContain('data-removed="alert(1)"')
  })
})
