import { describe, expect, it } from 'vitest'
import { createOpenApiSpec } from '../../src/lib/createOpenApiSpec'

describe('createOpenApiSpec with no spec', () => {
  const openapi = createOpenApiSpec()

  it('returns null for getOperation when paths are not defined', () => {
    const result = openapi.getOperation('someOperationId')
    expect(result).toBeNull()
  })

  it('returns null for getOperationPath when paths are not defined', () => {
    const result = openapi.getOperationPath('someOperationId')
    expect(result).toBeNull()
  })

  it('returns empty array for getOperationParameters when operation is not found', () => {
    const result = openapi.getOperationParameters('someOperationId')
    expect(result).toEqual([])
  })

  it('returns empty array for getOperationServers when servers are not defined', () => {
    const result = openapi.getOperationServers('someOperationId')
    expect(result).toEqual([])
  })

  it('returns empty array for getServers when servers are not defined', () => {
    const result = openapi.getServers()
    expect(result).toEqual([])
  })

  it('returns empty array for getTags when paths are not defined', () => {
    const result = openapi.getTags()
    expect(result).toEqual([])
  })
})
