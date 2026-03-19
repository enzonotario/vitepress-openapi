import { describe, expect, it } from 'vitest'
import { minifyHtml } from '../../../src/lib/utils/minifyHtml'

describe('minifyHtml', () => {
  it('should replace multiple whitespace characters with a single space', () => {
    const input = `
      <div class="test">
        <span>Hello World</span>
      </div>
    `
    const expected = '<div class="test"> <span>Hello World</span> </div>'
    expect(minifyHtml(input)).toBe(expected)
  })

  it('should trim whitespace from both ends', () => {
    const input = '   <span>Test</span>   '
    const expected = '<span>Test</span>'
    expect(minifyHtml(input)).toBe(expected)
  })

  it('should handle single-line strings correctly', () => {
    const input = '<span class="test">Single line</span>'
    expect(minifyHtml(input)).toBe(input)
  })

  it('should handle tabs and newlines as spaces', () => {
    const input = '<div>\n\t<span>Tab and newline</span>\n</div>'
    const expected = '<div> <span>Tab and newline</span> </div>'
    expect(minifyHtml(input)).toBe(expected)
  })
})
