import { describe, expect, it } from 'vitest'
import { hasNamedExamples, isNamedExample } from '../../../src/lib/examples/isNamedExample'

describe('isNamedExample', () => {
  it('returns true when name differs from stringified value', () => {
    expect(isNamedExample({ name: 'myExample', value: 'test' })).toBe(true)
    expect(isNamedExample({ name: 'example1', value: { foo: 'bar' } })).toBe(true)
    expect(isNamedExample({ name: 'numericExample', value: 123 })).toBe(true)
  })

  it('returns false when name equals stringified value', () => {
    expect(isNamedExample({ name: 'test', value: 'test' })).toBe(false)
    expect(isNamedExample({ name: '123', value: 123 })).toBe(false)
    expect(isNamedExample({ name: JSON.stringify({ foo: 'bar' }), value: { foo: 'bar' } })).toBe(false)
  })

  it('returns true when example has a summary', () => {
    expect(isNamedExample({ name: 'ex1', value: 'val', summary: 'A summary' })).toBe(true)
  })
})

describe('hasNamedExamples', () => {
  it('returns false for null or empty array', () => {
    expect(hasNamedExamples(null)).toBe(false)
    expect(hasNamedExamples([])).toBe(false)
  })

  it('returns true when at least one example is named', () => {
    expect(hasNamedExamples([
      { name: 'namedExample', value: 'test' },
      { name: 'another', value: 'another' },
    ])).toBe(true)
  })

  it('returns false when no examples are named', () => {
    expect(hasNamedExamples([
      { name: 'test', value: 'test' },
      { name: '123', value: 123 },
    ])).toBe(false)
  })

  it('returns true for typical OpenAPI named examples', () => {
    expect(hasNamedExamples([
      { name: 'success', value: { status: 'ok' }, summary: 'Successful response' },
      { name: 'error', value: { status: 'error' }, summary: 'Error response' },
    ])).toBe(true)
  })
})
