import { describe, expect, it } from 'vitest'
import { usePaths } from '../../src'
import { spec } from '../testsConstants'

describe('usePaths', () => {
  const paths = usePaths({ spec })

  it('returns the correct paths by verbs', () => {
    const result = paths.getPathsByVerbs()
    expect(result).toEqual([
      {
        path: '/users',
        verb: 'get',
        operationId: 'getUsers',
        summary: 'GET /users',
        tags: ['users'],
      },
      {
        path: '/users/{id}',
        verb: 'get',
        operationId: 'getUser',
        summary: 'GET /users/{id}',
        tags: ['users'],
      },
      {
        path: '/users/{id}/pets',
        verb: 'get',
        operationId: 'getUserPets',
        summary: 'Get a list of pets for a user',
        tags: ['pets'],
      },
    ])
  })

  it('returns the correct tags', () => {
    const result = paths.getTags()
    expect(result).toEqual([
      { name: 'users', description: 'Operations about users' },
      { name: 'pets', description: 'Operations about pets' },
    ])
  })

  it('returns operationsTags and Tags', () => {
    const result = usePaths({
      spec: {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              tags: ['users'],
            },
          },
          '/users/{id}': {
            get: {
              tags: ['missingTag'],
            },
          },
          '/users/{id}/pets': {
            get: {
              tags: ['pets'],
            },
          },
        },
        tags: [
          { name: 'users', description: 'Users operations' },
          { name: 'pets' },
          { name: 'tagWithoutOperations' },
        ],
      },
    }).getTags()

    expect(result).toEqual([
      { name: 'users', description: 'Users operations' },
      { name: 'pets', description: null },
      { name: 'missingTag', description: null },
    ])
  })
})
