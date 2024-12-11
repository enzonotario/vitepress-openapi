import { describe, expect, it } from 'vitest'
import { getConstraints, hasConstraints } from '../../src/lib/constraintsParser'

describe('hasConstraints', () => {
  it('returns true when property contains validation keywords', () => {
    const property = { format: 'date-time', type: 'string' }
    expect(hasConstraints(property)).toBe(true)
  })

  it('returns false when property does not contain validation keywords', () => {
    const property = { type: 'string' }
    expect(hasConstraints(property)).toBe(false)
  })

  it('returns false when property is empty', () => {
    const property = {}
    expect(hasConstraints(property)).toBe(false)
  })
})

describe('getConstraints', () => {
  it('extracts constraints from property containing validation keywords', () => {
    const property = { format: 'date-time', type: 'string', maxLength: 255 }
    const expectedConstraints = { format: 'date-time', maxLength: 255 }
    expect(getConstraints(property)).toEqual(expectedConstraints)
  })

  it('returns empty object when property does not contain validation keywords', () => {
    const property = { type: 'string' }
    expect(getConstraints(property)).toEqual({})
  })

  it('returns empty object when property is empty', () => {
    const property = {}
    expect(getConstraints(property)).toEqual({})
  })
})

describe('validation keywords', () => {
  it('extracts all validation keywords from property', () => {
    const property = {
      format: 'date-time',
      exclusiveMaximum: 10,
      exclusiveMinimum: 1,
      maximum: 100,
      maxItems: 10,
      maxLength: 255,
      maxProperties: 5,
      minimum: 0,
      minItems: 1,
      minLength: 1,
      minProperties: 1,
      multipleOf: 2,
      pattern: '^\\d+$',
      uniqueItems: true,
      default: 'custom',
      type: 'string', // non-validation keyword
    }
    const expectedConstraints = {
      format: 'date-time',
      exclusiveMaximum: 10,
      exclusiveMinimum: 1,
      maximum: 100,
      maxItems: 10,
      maxLength: 255,
      maxProperties: 5,
      minimum: 0,
      minItems: 1,
      minLength: 1,
      minProperties: 1,
      multipleOf: 2,
      pattern: '^\\d+$',
      uniqueItems: true,
      default: 'custom',
    }
    expect(getConstraints(property)).toEqual(expectedConstraints)
  })
})
