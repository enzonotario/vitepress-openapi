import { describe, expect, it } from 'vitest'
import { merge } from 'allof-merge'
import { generateSchemaJson } from '../../src/lib/generateSchemaJson'

describe('generateSchemaJson', () => {
  it('generates JSON for schema with string property', () => {
    const schema = {
      properties: {
        name: {
          type: 'string',
        },
      },
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({ name: 'string' }, null, 2))
  })

  it('generates JSON for schema with number property', () => {
    const schema = {
      properties: {
        age: {
          type: 'number',
        },
      },
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({ age: 0 }, null, 2))
  })

  it('generates JSON for schema with boolean property', () => {
    const schema = {
      properties: {
        isActive: {
          type: 'boolean',
        },
      },
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({ isActive: true }, null, 2))
  })

  it('generates JSON for schema with nested object property', () => {
    const schema = {
      properties: {
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
          },
        },
      },
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({ address: { street: 'string' } }, null, 2))
  })

  it('generates JSON for schema with array property', () => {
    const schema = {
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({ tags: ['string'] }, null, 2))
  })

  it('generates JSON for schema with mixed properties', () => {
    const schema = {
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
        isActive: {
          type: 'boolean',
        },
      },
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({ name: 'string', age: 0, isActive: true }, null, 2))
  })

  it('generates JSON for empty schema', () => {
    const schema = {}
    const result = generateSchemaJson(schema)
    expect(result).toBe(JSON.stringify({}, null, 2))
  })

  it('generates JSON for null schema', () => {
    const schema = null
    const result = generateSchemaJson(schema)
    expect(result).toBe('{}')
  })

  it('generates JSON for schema with array of strings using example', () => {
    const schema = {
      properties: {
        dates: {
          type: 'array',
          description: 'List of dates',
          items: {
            type: 'string',
            example: '2020-01-01',
            format: 'date',
          },
        },
      },
    }
    const result = generateSchemaJson(schema, true)
    expect(result).toBe(JSON.stringify({
      dates: ['2020-01-01'],
    }, null, 2))
  })

  it('generates JSON for schema with array of strings without example', () => {
    const schema = {
      properties: {
        dates: {
          type: 'array',
          description: 'List of dates',
          items: {
            type: 'string',
            example: '2020-01-01',
            format: 'date',
          },
        },
      },
    }
    const result = generateSchemaJson(schema, false)
    expect(result).toBe(JSON.stringify({
      dates: ['string'],
    }, null, 2))
  })

  it('generates JSON for schema with allOf', () => {
    const schema = {
      allOf: [
        {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
        {
          required: [
            'id',
          ],
          type: 'object',
          properties: {
            id: {
              description: 'Identification number of the plant',
              type: 'integer',
              format: 'int64',
            },
          },
        },
      ],
    }
    const result = generateSchemaJson(merge(schema))
    expect(result).toBe(JSON.stringify({
      name: 'string',
      id: 0,
    }, null, 2))
  })
})
