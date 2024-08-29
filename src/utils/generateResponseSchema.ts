import { resolveRef } from './resolveRef';

const primitiveSchemasTypes = ['string', 'number', 'integer', 'boolean', 'array', 'object']

export function generateResponseSchema(schemas: any, response: any) {
  return response?.content?.['application/json']?.schema
}

function generateSchemaRecursive(responseSchema: any, schemas: any, responseType: any) {
  if (responseSchema.$ref) {
    return generateSchemaRecursive(resolveRef(responseSchema.$ref, schemas), schemas, responseType)
  }

  if (responseSchema.type === 'array') {
    if (responseSchema.items.$ref) {
      return generateSchemaRecursive(resolveRef(responseSchema.items.$ref, schemas), schemas, 'array')
    }
    return responseSchema.items
  }
  else if (responseSchema.type === 'object') {
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
