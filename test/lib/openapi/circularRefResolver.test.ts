import { describe, expect, it } from 'vitest'
import { resolveCircularRef } from '../../../src/lib/parser/resolveCircularRef'

describe('resolveCircularRef', () => {
  it('resolves circular references in a simple schema', () => {
    const schema = {
      a: {
        b: {
          c: {},
        },
      },
    }
    schema.a.b.c = schema.a

    const result = resolveCircularRef(schema)

    expect(result.a.b.c.circularReference).toBe('/root/a')
  })

  it('resolves circular references in a nested schema', () => {
    const schema = {
      a: {
        b: {
          c: {
            d: {},
          },
        },
      },
    }
    schema.a.b.c.d = schema.a.b

    const result = resolveCircularRef(schema)

    expect(result.a.b.c.d.circularReference).toBe('/root/a/b')
  })

  it('handles schemas without circular references', () => {
    const schema = {
      a: {
        b: {
          c: {},
        },
      },
    }

    const result = resolveCircularRef(schema)

    expect(result).toEqual(schema)
  })

  it('handles empty schemas', () => {
    const schema = {}

    const result = resolveCircularRef(schema)

    expect(result).toEqual(schema)
  })

  it('handles schemas with primitive values', () => {
    const schema = {
      a: 1,
      b: 'string',
      c: true,
    }

    const result = resolveCircularRef(schema)

    expect(result).toEqual(schema)
  })

  it('handles schemas with arrays', () => {
    const schema = {
      a: [],
      b: {
        c: [],
      },
    }

    const result = resolveCircularRef(schema)

    expect(result).toEqual(schema)
  })

  it('handles schemas with circular references in arrays', () => {
    const schema = {
      a: [],
    }
    schema.a.push(schema.a)

    const result = resolveCircularRef(schema)

    expect(result.a[0].circularReference).toBe('/root/a')
  })
})
