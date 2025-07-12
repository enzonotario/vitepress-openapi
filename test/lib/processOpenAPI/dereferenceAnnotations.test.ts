import { describe, expect, it } from 'vitest'
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

const nestedSpec = {
  openapi: '3.1.0',
  info: { title: 'Test', version: '1.0.0' },
  components: {
    schemas: {
      Pet: {
        type: 'object',
        properties: {
          petType: { type: 'string', enum: ['cat', 'dog', 'lizard'] },
          hasFur: { $ref: '#/components/schemas/furBoolean' },
        },
      },
      Cat: {
        type: 'object',
        properties: {
          petType: { const: 'cat' },
          hasFur: {
            $ref: '#/components/schemas/furBoolean',
            description: 'Whether the cat has fur. True by default for most cats',
            default: true,
          },
        },
      },
      furBoolean: {
        description: `Whether the animal has fur (true), doesn't (false), or it's unknown or varies (null)`,
        type: ['boolean', 'null'],
        default: false,
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

  it('overrides property annotations when provided', () => {
    const result = parseOpenapi().parseSync({ spec: nestedSpec })
    const cat = result.components.schemas.Cat
    const pet = result.components.schemas.Pet

    expect(cat.properties.hasFur.description).toBe(
      'Whether the cat has fur. True by default for most cats',
    )
    expect(cat.properties.hasFur.default).toBe(true)

    expect(pet.properties.hasFur.description).toBe(
      `Whether the animal has fur (true), doesn't (false), or it's unknown or varies (null)`,
    )
    expect(pet.properties.hasFur.default).toBe(false)
  })
})
