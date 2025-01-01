import { describe, expect, it } from 'vitest'
import { generateMissingOperationIds } from '../../../src/lib/prepareOpenAPI/generateMissingOperationIds'

describe('generateMissingOperationIds', () => {
  it('adds operationId to verbs without operationId', () => {
    const input = {
      paths: {
        '/users': {
          get: {},
          post: { operationId: 'existingOperationId' },
        },
      },
    }
    const result = generateMissingOperationIds(input)
    expect(result.paths['/users'].get.operationId).toBe('get-users')
    expect(result.paths['/users'].post.operationId).toBe('existingOperationId')
  })

  it('does not modify paths that already have operationId', () => {
    const input = {
      paths: {
        '/users': {
          get: { operationId: 'existingGetOperationId' },
          post: { operationId: 'existingPostOperationId' },
        },
      },
    }
    const result = generateMissingOperationIds(input)
    expect(result.paths['/users'].get.operationId).toBe('existingGetOperationId')
    expect(result.paths['/users'].post.operationId).toBe('existingPostOperationId')
  })

  it('handles multiple paths and verbs', () => {
    const input = {
      paths: {
        '/users': {
          get: {},
          post: {},
        },
        '/products': {
          get: {},
          put: {},
        },
      },
    }
    const result = generateMissingOperationIds(input)
    expect(result.paths['/users'].get.operationId).toBe('get-users')
    expect(result.paths['/users'].post.operationId).toBe('post-users')
    expect(result.paths['/products'].get.operationId).toBe('get-products')
    expect(result.paths['/products'].put.operationId).toBe('put-products')
  })

  it('handles paths with special characters', () => {
    const input = {
      paths: {
        '/users/{userId}': {
          get: {},
        },
      },
    }
    const result = generateMissingOperationIds(input)
    expect(result.paths['/users/{userId}'].get.operationId).toBe('get-users-{userId}')
  })

  it('returns the same object if no paths are provided', () => {
    const input = {}
    const result = generateMissingOperationIds(input)
    expect(result).toEqual(input)
  })
})
