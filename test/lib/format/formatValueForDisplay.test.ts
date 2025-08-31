import { describe, expect, it } from 'vitest'
import { formatValueForDisplay, formatValueForPlaceholder } from '../../../src/lib/format/formatValueForDisplay'

describe('formatValueForDisplay', () => {
  it('stringifies objects and arrays as JSON (single line)', () => {
    expect(formatValueForDisplay({ a: 1 })).toBe('{"a":1}')
    expect(formatValueForDisplay([1, 2])).toBe('[1,2]')
  })

  it('returns JSON strings as-is (no extra escaping)', () => {
    const s1 = '{"limit":10,"order":["timestamp DESC"]}'
    const s2 = '[{"x":1}]'
    expect(formatValueForDisplay(s1)).toBe(s1)
    expect(formatValueForDisplay(s2)).toBe(s2)
  })

  it('keeps quotes around normal strings to distinguish from primitives', () => {
    expect(formatValueForDisplay('hello')).toBe('"hello"')
  })

  it('formats primitives consistently', () => {
    expect(formatValueForDisplay(42)).toBe('42')
    expect(formatValueForDisplay(true)).toBe('true')
    expect(formatValueForDisplay(false)).toBe('false')
    expect(formatValueForDisplay(null as any)).toBe('null')
  })

  it('undefined -> empty string', () => {
    expect(formatValueForDisplay(undefined as any)).toBe('')
  })
})

describe('formatValueForPlaceholder', () => {
  it('stringifies objects and arrays to JSON', () => {
    expect(formatValueForPlaceholder({ a: 1 })).toBe('{"a":1}')
    expect(formatValueForPlaceholder([1, 2])).toBe('[1,2]')
  })

  it('returns JSON strings as-is (no extra escaping)', () => {
    const s1 = '{"where":{"x":1}}'
    const s2 = '[{"x":1}]'
    expect(formatValueForPlaceholder(s1)).toBe(s1)
    expect(formatValueForPlaceholder(s2)).toBe(s2)
  })

  it('for normal strings, does not add quotes', () => {
    expect(formatValueForPlaceholder('hello')).toBe('hello')
  })

  it('converts primitives to strings', () => {
    expect(formatValueForPlaceholder(42)).toBe('42')
    expect(formatValueForPlaceholder(true)).toBe('true')
    expect(formatValueForPlaceholder(false)).toBe('false')
  })

  it('null/undefined -> empty string', () => {
    expect(formatValueForPlaceholder(null as any)).toBe('')
    expect(formatValueForPlaceholder(undefined as any)).toBe('')
  })
})
