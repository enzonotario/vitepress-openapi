const primitiveSchemasTypes = ['string', 'number', 'integer', 'boolean', 'array', 'object']

export function generateResponseSchema(schemas: any, operation: any) {
  const responseSchema = operation?.responses['200'] && operation?.responses['200']?.content ? operation?.responses['200']?.content['application/json']?.schema : null
  const responseType = responseSchema?.type
  return generateSchemaRecursive({
    ...responseSchema,
    type: responseSchema?.type ?? 'object',
  }, schemas, responseType)
}

function generateSchemaRecursive(responseSchema: any, schemas: any, responseType: any) {
  if (responseSchema.type === 'array') {
    if (responseSchema.items.$ref) {
      return generateSchemaRecursive(resolveRef(responseSchema.items.$ref, schemas), schemas, 'array')
    }
    return responseSchema.items
  }
  else if (responseSchema.type === 'object') {
    if (responseSchema.$ref) {
      return generateSchemaRecursive(resolveRef(responseSchema.$ref, schemas), schemas, 'object')
    }
    const properties = responseSchema.properties
    const resolvedProperties = {}
    for (const key in properties) {
      const value = properties[key]

      resolvedProperties[key] = generateSchemaRecursive(value, schemas, value.type)
    }
    return {
      ...responseSchema,
      properties: resolvedProperties,
      type: responseType ?? 'object',
    }
  }
  else if (primitiveSchemasTypes.includes(responseSchema.type)) {
    return responseSchema
  }
}

function resolveRef(ref: string, schemas: any) {
  const refName = ref.split('/').pop()
  return schemas[refName]
}
