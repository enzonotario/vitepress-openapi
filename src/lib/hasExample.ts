import type { OpenAPI } from '@scalar/openapi-types'

export function hasExample(schema: Partial<OpenAPI.SchemaObject>): boolean {
  if (!schema || typeof schema !== 'object') {
    return false
  }

  try {
    const json = JSON.stringify(schema)
    const regex = /[{,]\s*"(?:example|examples)":/
    return regex.test(json)
  } catch (error) {
    console.warn('Failed to serialize schema:', error)
    return false
  }
}
