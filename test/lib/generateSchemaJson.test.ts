import { describe, expect, it } from 'vitest'
import { merge } from 'allof-merge'
import { dereferenceSync } from '@trojs/openapi-dereference'
import { generateSchemaJson } from '../../src/lib/generateSchemaJson'
import { specWithCircularRef, specWithMultipleLevels } from '../testsConstants'
import { formatJson } from '../../src/lib/formatJson'

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

  it('generates JSON for primitive string schema', () => {
    const schema = {
      type: 'string',
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe('string')
  })

  it('generates JSON for primitive number schema', () => {
    const schema = {
      type: 'number',
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(0)
  })

  it('generates JSON for primitive boolean schema', () => {
    const schema = {
      type: 'boolean',
    }
    const result = generateSchemaJson(schema)
    expect(result).toBe(true)
  })
})

describe('schema with circular references', () => {
  it('generates JSON for schema with circular references', () => {
    const schema = dereferenceSync(merge(specWithCircularRef)).components.schemas.Parent
    const result = generateSchemaJson(schema)
    expect(result).toBe(
      formatJson({
        id: 'string',
        child: {
          id: 'string',
          parent: {
            id: 'string',
            child: {
              id: 'string',
              parent: {
                id: 'string',
                child: {
                  id: 'string',
                  parent: '[Circular Reference]',
                },
              },
            },
          },
        },
      }),
    )
  })
})

describe('schema with multiple levels', () => {
  it('generates JSON for schema with circular references', () => {
    const schema = dereferenceSync(merge(specWithMultipleLevels)).components.schemas.Level1
    const result = generateSchemaJson(schema)
    expect(result).toBe(
      formatJson({
        id: 'string',
        level2: {
          id: 'string',
          level3: {
            id: 'string',
            level4: {
              id: 'string',
              level5: {
                id: 'string',
                level6: {
                  id: 'string',
                  level7: {
                    id: 'string',
                    level8: {
                      id: 'string',
                      level9: {
                        id: 'string',
                        level10: {
                          id: 'string',
                          level11: {
                            id: 'string',
                            level12: {
                              id: 'string',
                              level13: {
                                id: 'string',
                                level14: {
                                  id: 'string',
                                  level15: {
                                    id: 'string',
                                    level16: {
                                      id: 'string',
                                      level17: {
                                        id: 'string',
                                        level18: {
                                          id: 'string',
                                          level19: {
                                            id: 'string',
                                            level20: {
                                              id: 'string',
                                              finalValue: 'string',
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    )
  })
})
