import { describe, expect, it } from 'vitest'
import { getPropertyExample } from '../../../src/lib/examples/getPropertyExample'

describe('getPropertyExample', () => {
  it('returns the example property if it exists', () => {
    const property = { example: 'exampleValue' }
    expect(getPropertyExample(property)).toBe('exampleValue')
  })

  it('returns the first example from examples array if example property does not exist', () => {
    const property = { examples: ['example1', 'example2'] }
    expect(getPropertyExample(property)).toBe('example1')
  })

  it('returns the schema example if example and examples properties do not exist', () => {
    const property = { schema: { example: 'schemaExample' } }
    expect(getPropertyExample(property)).toBe('schemaExample')
  })

  it('returns the first example from schema examples array if example and examples properties do not exist', () => {
    const property = { schema: { examples: ['schemaExample1', 'schemaExample2'] } }
    expect(getPropertyExample(property)).toBe('schemaExample1')
  })

  it('returns the subexample property if example, examples, and schema properties do not exist', () => {
    const property = { subexample: 'subexampleValue' }
    expect(getPropertyExample(property)).toBe('subexampleValue')
  })

  it('returns the first subexample from subexamples array if example, examples, and schema properties do not exist', () => {
    const property = { subexamples: ['subexample1', 'subexample2'] }
    expect(getPropertyExample(property)).toBe('subexample1')
  })

  it('returns null if no example, examples, schema, or subexample properties exist', () => {
    const property = {}
    expect(getPropertyExample(property)).toBeNull()
  })

  it('returns an empty string if example property is an empty string', () => {
    const property = { example: '' }
    expect(getPropertyExample(property)).toBe('')
  })

  it('returns an empty string if schema.example property is an empty string', () => {
    const property = { schema: { example: '' } }
    expect(getPropertyExample(property)).toBe('')
  })

  it('returns an empty string for subexample property if it is an empty string', () => {
    const property = { subexample: '' }
    expect(getPropertyExample(property)).toBe('')
  })
})
