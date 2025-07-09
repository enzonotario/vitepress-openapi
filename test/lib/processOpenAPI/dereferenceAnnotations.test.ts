import { describe, it, expect } from 'vitest'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'

const spec = {
  openapi: '3.1.0',
  info: { title: 'Test', version: '1.0.0' },
  components: {
    schemas: {
      Base: {
        type: 'object',
        description: 'base description',
        default: { foo: 'bar' },
        properties: {
          foo: { type: 'string' },
        },
      },
      Override: {
        $ref: '#/components/schemas/Base',
        description: 'override description',
        default: { foo: 'baz' },
      },
    },
  },
}

describe('dereference with local annotations', () => {
  it('uses local annotation fields over referenced ones', () => {
    const result = parseOpenapi().parseSync({ spec })
    const schema = result.components.schemas.Override
    expect(schema.description).toBe('override description')
    expect(schema.default.foo).toBe('baz')
  })
})
