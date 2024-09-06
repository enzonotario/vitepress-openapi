export function generateSchemaJson(schema: any, useExample = false) {
  try {
    return JSON.stringify(
        propertiesTypesJsonRecursive(schema, useExample),
        null,
        2,
    )
  } catch {
    return '{}'
  }
}

export function propertiesTypesJsonRecursive(schema: any, useExample = false) {
  if (schema?.items) {
    return [getPropertyValue(schema.items, useExample)]
  }

  if (!schema?.properties) {
    return schema
  }

  const propertiesKeys = Object.keys(schema.properties)

  const properties = {}

  propertiesKeys.forEach((key) => {
    const property = schema.properties[key]
    properties[key] = getPropertyValue(property, useExample)
  })

  return properties
}

function getPropertyValue(property: any, useExample: boolean) {
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
        return [getPropertyValue(property.items, useExample)]
      }
      return []
    case 'object':
      if (property.properties) {
        return propertiesTypesJsonRecursive(property, useExample)
      }
      return {}
    default:
      return null
  }
}
