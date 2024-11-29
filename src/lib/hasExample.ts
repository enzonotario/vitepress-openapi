import type { OpenAPI } from '@scalar/openapi-types'

export function hasExample(schema: Partial<OpenAPI.SchemaObject>): boolean {
  if (!schema || typeof schema !== 'object') {
    return false
  }
  const visited = new Set()
  function containsExample(obj: any): boolean {
    if (visited.has(obj)) {
      return false
    }
    visited.add(obj)
    if ('example' in obj || 'examples' in obj) {
      return true
    }
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (containsExample(obj[key])) {
          return true
        }
      }
    }
    return false
  }
  return containsExample(schema)
}
