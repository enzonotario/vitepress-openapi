import { describe, expect, it } from 'vitest'
import { isNamedExamplesMap } from '../../../src/lib/examples/isNamedExamplesMap'

describe('isNamedExamplesMap', () => {
  it('returns false for null/undefined', () => {
    expect(isNamedExamplesMap(null as any)).toBe(false)
    expect(isNamedExamplesMap(undefined as any)).toBe(false)
  })

  it('returns false for arrays', () => {
    expect(isNamedExamplesMap([] as any)).toBe(false)
    expect(isNamedExamplesMap([1, 2, 3] as any)).toBe(false)
  })

  it('returns false for empty object', () => {
    expect(isNamedExamplesMap({})).toBe(false)
  })

  it('returns false for plain JSON object example (e.g., { a: 1 })', () => {
    expect(isNamedExamplesMap({ a: 1 })).toBe(false)
    expect(isNamedExamplesMap({ a: 1, b: 2 })).toBe(false)
  })

  it('returns false when entries are objects without ExampleObject keys', () => {
    expect(isNamedExamplesMap({ ex1: { foo: 'bar' }, ex2: { baz: 123 } })).toBe(false)
  })

  it('returns false when an entry is null', () => {
    expect(isNamedExamplesMap({ ex1: null as any })).toBe(false)
  })

  it('returns false when Example-like key is nested, not top-level', () => {
    expect(isNamedExamplesMap({ ex1: { data: { value: 1 } } })).toBe(false)
  })

  it('returns true when any entry resembles an OpenAPI ExampleObject', () => {
    expect(isNamedExamplesMap({ ex1: { value: { a: 1 } } })).toBe(true)
    expect(isNamedExamplesMap({ ex1: { externalValue: 'http://example.com' } })).toBe(true)
    expect(isNamedExamplesMap({ ex1: { $ref: '#/components/examples/Foo' } })).toBe(true)

    expect(isNamedExamplesMap({ ex1: { summary: 's' } })).toBe(false)
    expect(isNamedExamplesMap({ ex1: { description: 'd' } })).toBe(false)
  })

  it('returns true for mixed entries when at least one is ExampleObject-shaped', () => {
    const input = {
      notExample: { foo: 'bar' },
      named: { value: 'ok' },
      primitive: 42,
    } as any
    expect(isNamedExamplesMap(input)).toBe(true)
  })
})
