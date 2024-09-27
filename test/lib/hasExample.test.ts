import { describe, expect, it } from 'vitest'
import { dereferenceSync } from '@trojs/openapi-dereference'
import { merge } from 'allof-merge'
import { hasExample } from '../../src/lib/hasExample'
import { specWithCircularRef, specWithCircularRefAndExample } from '../testsConstants'

describe('hasExample', () => {
  it('returns true if schema has an example at the root level', () => {
    const schema = { example: 'exampleValue' }
    expect(hasExample(schema)).toBe(true)
  })

  it('returns true if schema has an example in properties', () => {
    const schema = {
      properties: {
        prop1: { example: 'exampleValue' },
      },
    }
    expect(hasExample(schema)).toBe(true)
  })

  it('returns true if schema has an example in nested properties', () => {
    const schema = {
      properties: {
        prop1: {
          properties: {
            nestedProp: { example: 'exampleValue' },
          },
        },
      },
    }
    expect(hasExample(schema)).toBe(true)
  })

  it('returns true if schema has an example in items', () => {
    const schema = {
      items: { example: 'exampleValue' },
    }
    expect(hasExample(schema)).toBe(true)
  })

  it('returns true if schema has an example in nested items', () => {
    const schema = {
      items: {
        items: { example: 'exampleValue' },
      },
    }
    expect(hasExample(schema)).toBe(true)
  })

  it('returns false if schema has no example', () => {
    const schema = {
      properties: {
        prop1: {},
      },
    }
    expect(hasExample(schema)).toBe(false)
  })

  it('returns false if schema is empty', () => {
    const schema = {}
    expect(hasExample(schema)).toBe(false)
  })

  it('returns false if schema is null', () => {
    const schema = null
    expect(hasExample(schema)).toBe(false)
  })

  it('returns false if schema is undefined', () => {
    const schema = undefined
    expect(hasExample(schema)).toBe(false)
  })
})

describe('schema with circular references', () => {
  it('returns false if schema with circular references has no example', () => {
    const schema = dereferenceSync(merge(specWithCircularRef)).components.schemas.Parent
    const result = hasExample(schema)
    expect(result).toBe(false)
  })

  it('returns true if schema with circular references has an example', () => {
    const schema = dereferenceSync(merge(specWithCircularRefAndExample)).components.schemas.Parent
    schema.example = 'exampleValue'
    const result = hasExample(schema)
    expect(result).toBe(true)
  })
})
