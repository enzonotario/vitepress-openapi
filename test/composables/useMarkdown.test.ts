import { describe, expect, it } from 'vitest'
import { useMarkdown } from '../../src/composables/useMarkdown'

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
})
