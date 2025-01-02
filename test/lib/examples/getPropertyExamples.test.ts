import { describe, expect, it } from 'vitest'
import { getPropertyExamples } from '../../../src/lib/examples/getPropertyExamples'

describe('getPropertyExamples', () => {
  it('returns an array with the example property if it exists', () => {
    const property = { example: 'exampleValue' }
    expect(getPropertyExamples(property)).toEqual(['exampleValue'])
  })

  it('returns the examples array if examples property exists', () => {
    const property = { examples: ['example1', 'example2'] }
    expect(getPropertyExamples(property)).toEqual(['example1', 'example2'])
  })

  it('returns null if neither example nor examples properties exist', () => {
    const property = {}
    expect(getPropertyExamples(property)).toBeNull()
  })

  it('returns an empty array if example property is an empty string', () => {
    const property = { example: '' }
    expect(getPropertyExamples(property)).toEqual([''])
  })

  it('returns an empty array if examples property is an empty array', () => {
    const property = { examples: [] }
    expect(getPropertyExamples(property)).toEqual([])
  })
})
