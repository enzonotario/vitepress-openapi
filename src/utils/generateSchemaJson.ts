export function generateSchemaJson(schema: any) {
  return JSON.stringify(
      propertiesTypesJsonRecursive(schema),
      null,
      2,
  )
}

export function propertiesTypesJsonRecursive(schema: any) {
  if (schema?.items) {
    return [propertiesTypesJsonRecursive(schema.items)]
  }

  if (!schema?.properties) {
    return schema
  }

  const propertiesKeys = Object.keys(schema.properties)

  const properties = {}

  propertiesKeys.forEach((key) => {
    const property = schema.properties[key]

    const { type, example } = property

    if (example) {
      properties[key] = example
      return
    }

    switch (type) {
      case 'string':
        properties[key] = 'string'
        break
      case 'number':
      case 'integer':
        properties[key] = 0
        break
      case 'boolean':
        properties[key] = true
        break
      case 'array':
        if (property.items) {
          properties[key] = [propertiesTypesJsonRecursive(property.items)]
          break
        }

        properties[key] = []
        break
      case 'object':
        if (property.properties) {
          properties[key] = propertiesTypesJsonRecursive(property)
          break
        }
        properties[key] = {}
        break
      default:
        properties[key] = null
    }
  })

  return properties
}
