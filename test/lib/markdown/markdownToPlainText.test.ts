import { describe, expect, it } from 'vitest'
import { markdownToPlainText } from '../../../src/lib/markdown/markdownToPlainText'

describe('markdownToPlainText', () => {
  it('returns plain sentences unchanged', () => {
    expect(markdownToPlainText('Returns a list of users.')).toBe('Returns a list of users.')
  })

  it('strips markdown formatting but keeps the text', () => {
    expect(markdownToPlainText('Returns **all** `users` for the *current* account.'))
      .toBe('Returns all users for the current account.')
  })

  it('keeps link text and drops the URL', () => {
    expect(markdownToPlainText('See [the guide](https://example.com/guide) for details.'))
      .toBe('See the guide for details.')
  })

  it('does not mangle identifiers containing underscores', () => {
    expect(markdownToPlainText('Filter by `group_id` or snake_case_field.'))
      .toBe('Filter by group_id or snake_case_field.')
  })

  it('strips headings and blockquotes', () => {
    expect(markdownToPlainText('# Overview\n\n> Note: beta endpoint.\n\nReturns users.'))
      .toBe('Overview Note: beta endpoint. Returns users.')
  })

  it('strips embedded HTML tags but keeps their text content', () => {
    expect(markdownToPlainText('Returns users. <span class="badge">Beta</span>'))
      .toBe('Returns users. Beta')
  })

  it('collapses newlines and repeated whitespace into single spaces', () => {
    expect(markdownToPlainText('First line.\n\nSecond   line.'))
      .toBe('First line. Second line.')
  })

  it('decodes HTML entities produced by rendering', () => {
    expect(markdownToPlainText('Filters & sorting, e.g. `a < b`.'))
      .toBe('Filters & sorting, e.g. a < b.')
  })

  it('returns an empty string for empty or missing input', () => {
    expect(markdownToPlainText('')).toBe('')
    expect(markdownToPlainText(undefined)).toBe('')
    expect(markdownToPlainText(null)).toBe('')
  })

  it('truncates at a word boundary when maxLength is set', () => {
    const result = markdownToPlainText('Returns every user registered in the current account.', { maxLength: 30 })
    expect(result).toBe('Returns every user…')
    expect(result.length).toBeLessThanOrEqual(30)
  })

  it('does not truncate text shorter than maxLength', () => {
    expect(markdownToPlainText('Returns users.', { maxLength: 30 })).toBe('Returns users.')
  })
})
