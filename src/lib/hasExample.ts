import type { OpenAPI } from '@scalar/openapi-types'

export function hasExample(schema: Partial<OpenAPI.SchemaObject>): boolean {
  try {
    const json = JSON.stringify(schema)
    // Matches any property with the key "example" or "examples".
    const regex = /"example":|"examples":/
    return regex.test(json)
  } catch (error) {
    console.warn('Failed to serialize schema:', error)
    return true
  }
}
