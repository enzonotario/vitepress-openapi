import { describe, expect, it } from 'vitest'
import { OpenApi } from 'vitepress-theme-openapi'
import { useSidebar } from './src/composables/useSidebar'

describe('useOpenapi with no spec', () => {
  const openapi = OpenApi()

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

  it('returns empty string for getBaseUrl when servers are not defined', () => {
    const result = openapi.getBaseUrl()
    expect(result).toBe('http://localhost')
  })

  it('returns empty array for getTags when paths are not defined', () => {
    const result = useSidebar().getTags()
    expect(result).toEqual([])
  })
})
