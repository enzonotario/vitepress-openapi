import { describe, expect, it } from 'vitest'
import { normalizeExamples } from '../../../src/lib/examples/normalizeExamples'

describe('normalizeExamples', () => {
  it('returns null for null or undefined', () => {
    expect(normalizeExamples(null)).toBeNull()
    expect(normalizeExamples(undefined as any)).toBeNull()
  })

  it('normalizes arrays of primitives and objects', () => {
    const input = [1, 'a', { x: 1 }]
    const result = normalizeExamples(input)
    expect(result).toEqual([
      { name: '1', value: 1 },
      { name: 'a', value: 'a' },
      { name: JSON.stringify({ x: 1 }), value: { x: 1 } },
    ])
  })

  it('normalizes named examples map with value, $ref, and externalValue and preserves summary', () => {
    const input = {
      a: { value: 123, summary: 'sum a' },
      b: { $ref: '#/components/examples/E1', summary: 'sum b' },
      c: { externalValue: 'http://example.com/e.json', summary: 'sum c' },
      d: {},
      e: 'plain',
    } as const

    const result = normalizeExamples(input)

    expect(result).toEqual([
      { name: 'a', value: 123, summary: 'sum a' },
      { name: 'b', value: { $ref: '#/components/examples/E1' }, summary: 'sum b' },
      { name: 'c', value: 'http://example.com/e.json', summary: 'sum c' },
      { name: 'd', value: null, summary: undefined },
      { name: 'e', value: 'plain', summary: undefined },
    ])
  })

  it('treats a plain object as a single example when not a named examples map', () => {
    const input = { foo: 'bar' }
    const result = normalizeExamples(input)
    expect(result).toEqual([{ name: JSON.stringify({ foo: 'bar' }), value: { foo: 'bar' } }])
  })

  it('normalizes primitives to single-item list', () => {
    expect(normalizeExamples(42)).toEqual([{ name: '42', value: 42 }])
    expect(normalizeExamples('hello')).toEqual([{ name: 'hello', value: 'hello' }])
    expect(normalizeExamples(true)).toEqual([{ name: 'true', value: true }])
  })
})
