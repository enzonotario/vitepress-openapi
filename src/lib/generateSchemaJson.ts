import { formatJson } from './formatJson'

export function generateSchemaJson(schema: any, useExample = false) {
  if (schema === null || schema === undefined) {
    return '{}'
  }

  const properties = propertiesTypesJsonRecursive(schema, useExample, new Set())

  if (typeof properties === 'string' || typeof properties === 'number' || typeof properties === 'boolean') {
    return properties
  }

  return formatJson(properties)
}

export function propertiesTypesJsonRecursive(schema: any, useExample = false, visited = new Set(), level = 0) {
  if (visited.has(schema)) {
    if (level > 10) {
      return '[Circular Reference]'
    }
    visited = new Set()
  }

  visited.add(schema)

  if (schema?.items) {
    return [getPropertyValue(schema.items, useExample, new Set(visited), level + 1)]
  }

  if (!schema?.properties) {
    return getPropertyValue(schema, useExample, new Set(visited), level)
  }

  const propertiesKeys = Object.keys(schema.properties)

  const properties: Record<string, any> = {}

  propertiesKeys.forEach((key) => {
    const property = schema.properties[key]
    properties[key] = getPropertyValue(property, useExample, new Set(visited), level + 1)
  })

  return properties
}

function getPropertyValue(property: any, useExample: boolean, visited: Set<any>, level: number) {
  const { type, example } = property

  if (useExample && example) {
    return example
  }

  switch (type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return 0
    case 'boolean':
      return true
    case 'array':
      if (property.items) {
        return [getPropertyValue(property.items, useExample, new Set(visited), level + 1)]
      }
      return []
    case 'object':
      if (property.properties) {
        return propertiesTypesJsonRecursive(property, useExample, new Set(visited), level + 1)
      }
      return {}
    default:
      return null
  }
}
