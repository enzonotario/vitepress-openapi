import { describe, it, expect } from 'vitest'
import { generateResponseSchema } from '../../src/utils/generateResponseSchema'

describe('generateResponseSchema', () => {
  it('simple case', () => {
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: { type: 'string' }
            }
          }
        }
      }
    }
    const result = generateResponseSchema({}, operation)
    expect(result).toEqual({ type: 'string' })
  })

  it('basic ref case', () => {
    const schemas = {
      Item: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: { $ref: '#/Item' }
            }
          }
        }
      }
    }
    const result = generateResponseSchema(schemas, operation)
    expect(result).toEqual({
      type: 'object',
      properties: {
        id: { type: 'string' }
      }
    })
  })

  it('resolves nested object schemas correctly', () => {
    const schemas = {
      Parent: {
        type: 'object',
        properties: {
          child: { $ref: '#/Child' }
        }
      },
      Child: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: { $ref: '#/Parent' }
            }
          }
        }
      }
    }
    const result = generateResponseSchema(schemas, operation)
    expect(result).toEqual({
      type: 'object',
      properties: {
        child: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    })
  })

  it('handles recursive schemas without infinite loop', () => {
    const schemas = {
      Recursive: {
        type: 'object',
        properties: {
          self: { $ref: '#/Recursive' }
        }
      }
    }
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: { $ref: '#/Recursive' }
            }
          }
        }
      }
    }
    const result = generateResponseSchema(schemas, operation)
    expect(result).toEqual({
      type: 'object',
      properties: {
        self: {
          type: 'object',
          properties: {
            self: {
              // Test should verify that this does not cause infinite recursion
              // and that some form of recursion handling is implemented.
            }
          }
        }
      }
    })
  })

  it('returns undefined for unresolved $ref', () => {
    const schemas = {}
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: { $ref: '#/NonExistent' }
            }
          }
        }
      }
    }
    const result = generateResponseSchema(schemas, operation)
    expect(result).toBeUndefined()
  })

  it('correctly handles array of primitives', () => {
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        }
      }
    }
    const result = generateResponseSchema({}, operation)
    expect(result).toEqual({
      type: 'array',
      items: { type: 'string' }
    })
  })

  it('resolves $ref in array items correctly', () => {
    const schemas = {
      Item: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
    const operation = {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/Item' }
              }
            }
          }
        }
      }
    }
    const result = generateResponseSchema(schemas, operation)
    expect(result).toEqual({
      type: 'array',
      properties: {
        id: { type: 'string' }
      }
    })
  })
})
