import { describe, expect, it } from 'vitest'
import { useMarkdown } from '../../src/composables/useMarkdown'
import { useTheme } from '../../src/composables/useTheme'

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
})
