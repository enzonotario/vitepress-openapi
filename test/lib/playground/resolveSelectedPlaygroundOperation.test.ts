import { describe, expect, it } from 'vitest'
import { createOpenApiSpec } from '../../../src'
import { resolveSelectedPlaygroundOperation } from '../../../src/lib/playground/resolveSelectedPlaygroundOperation'
import { spec } from '../../testsConstants'

describe('resolveSelectedPlaygroundOperation', () => {
  const openapi = createOpenApiSpec({ spec })
  const operations = openapi.getOperations()

  it('returns the operation referenced by the current hash', () => {
    const operation = resolveSelectedPlaygroundOperation({
      hash: '#getUserPets',
      operations,
    })

    expect(operation?.operationId).toBe('getUserPets')
  })

  it('falls back to the first operation when the hash does not match any operation', () => {
    const operation = resolveSelectedPlaygroundOperation({
      hash: '#missing-operation',
      operations,
    })

    expect(operation?.operationId).toBe(operations[0]?.operationId)
  })

  it('supports encoded operation ids in the hash', () => {
    const operation = resolveSelectedPlaygroundOperation({
      hash: '#%67etUserPets',
      operations,
    })

    expect(operation?.operationId).toBe('getUserPets')
  })

  it('returns null when there are no operations available', () => {
    const operation = resolveSelectedPlaygroundOperation({
      hash: '#missing-operation',
      operations: [],
    })

    expect(operation).toBeNull()
  })
})
