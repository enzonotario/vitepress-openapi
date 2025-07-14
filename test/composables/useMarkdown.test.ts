import { describe, expect, it, vi } from 'vitest'
import MarkdownIt from 'markdown-it'
import { useMarkdown } from '../../src/composables/useMarkdown'
import { useTheme } from '../../src/composables/useTheme'
import { useOpenapi } from '../../src/composables/useOpenapi'
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
