import { resolveRef } from './resolveRef';

const primitiveSchemasTypes = ['string', 'number', 'integer', 'boolean', 'array', 'object']

export function generateRequestBodySchema(schemas: any, requestBody: any) {
  const requestBodySchema = requestBody?.content?.['application/json']?.schema
  const requestBodyType = requestBodySchema?.type ?? 'object'
  return generateSchemaRecursive({
    ...requestBodySchema,
    type: requestBodyType,
  }, schemas, requestBodyType)
}

function generateSchemaRecursive(schema: any, schemas: any, schemaType: any) {
  if (schema.$ref) {
    return generateSchemaRecursive(resolveRef(schema.$ref, schemas), schemas, schemaType)
  }

  if (schema.type === 'array') {
    if (schema.items.$ref) {
      return generateSchemaRecursive(resolveRef(schema.items.$ref, schemas), schemas, 'array')
    }
    return schema.items
  } else if (schema.type === 'object') {
    const properties = schema.properties
    const resolvedProperties = {}
    for (const key in properties) {
      const value = properties[key]
      resolvedProperties[key] = generateSchemaRecursive(value, schemas, value.type)
    }
    return {
      ...schema,
      properties: resolvedProperties,
      type: schemaType ?? 'object',
    }
  } else if (primitiveSchemasTypes.includes(schema.type)) {
    return schema
  }
}

