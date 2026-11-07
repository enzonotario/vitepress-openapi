import type { JSONSchemaType, OAProperty } from '../parser/getSchemaUi'
import { literalTypes } from '../../index'
import { getPropertyExample } from './getPropertyExample'

export function getSchemaUiJson(uiProperties: OAProperty[] | OAProperty, useExample = false): any {
  return schemaUiToJson(uiProperties, useExample)
}

function schemaUiToJson(uiProperties: OAProperty[] | OAProperty, useExample: boolean): any {
  if (Array.isArray(uiProperties)) {
    return uiProperties.map(property => uiPropertyToJson(property, useExample))
  }
  return uiPropertyToJson(uiProperties, useExample)
}

function uiPropertyToJson(property: OAProperty, useExample: boolean): any {
  if (property.meta?.isCircularReference) {
    return '[Circular Reference]'
  }

  if (property.meta?.isConstant) {
    return uiPropertyConstantToJson(property)
  }

  if (isSingleType(property, 'array')) {
    return uiPropertyArrayToJson(property, useExample)
  }

  // Resolve oneOf/anyOf before literal-type collapsing so nested member
  // examples/enums/formats (e.g. OAS 3.1 nullable anyOf) are not skipped.
  if (isUnionProperty(property)) {
    return resolveUnionProperty(property, useExample)
  }

  if (isLiteralType(property)) {
    return uiPropertyLiteralToJson(property, useExample)
  }

  if (hasAllLiteralTypes(property)) {
    // Return the first literal type, prioritizing a non-null type.
    return uiPropertyLiteralToJson({
      ...property,
      types: [property.types.find(type => type !== 'null') ?? 'null'],
    }, useExample)
  }

  if (containsType(property, 'object')) {
    return uiPropertyObjectToJson(property.properties || [], useExample)
  }

  return getDefaultValueForType(
    property.types[0] ?? 'string',
    property.defaultValue,
    useExample ? property.constraints?.format as string | undefined : undefined,
  )
}

function uiPropertyArrayToJson(property: OAProperty, useExample: boolean): any {
  if (isUnionProperty(property)) {
    return [resolveUnionProperty(property, useExample)]
  }

  if (property.meta?.hasPrefixItems && property.properties && Array.isArray(property.properties)) {
    return property.properties.map((prop) => {
      return uiPropertyToJson(prop, useExample)
    })
  }

  if (property.properties && Array.isArray(property.properties)) {
    return [uiPropertyObjectToJson(property.properties, useExample)]
  }

  // Primitive item enum/format live on `property.items`, not the array node.
  // Untyped items (e.g. `items: { enum: [...] }`) have no `subtype`, so check first.
  if (property.items) {
    return [uiPropertyToJson(property.items, useExample)]
  }

  if (property.subtype) {
    if (property.subtype === 'object' && property.properties) {
      return [uiPropertyObjectToJson(property.properties as OAProperty[], useExample)]
    }

    if (useExample) {
      const format = property.constraints?.format as string | undefined
      return [
        getPropertyExample(property)
        ?? getEnumDefaultValue(property)
        ?? getDefaultValueForType(property.subtype, property.defaultValue, format),
      ]
    }

    return [getDefaultValueForType(property.subtype, property.defaultValue)]
  }

  return []
}

function uiPropertyObjectToJson(properties: OAProperty[], useExample: boolean): Record<string, any> {
  return properties.reduce((result: { [key: string]: any }, property) => {
    if (isSingleType(property, 'array')) {
      result[property.name] = uiPropertyArrayToJson(property, useExample)
    } else {
      result[property.name] = uiPropertyToJson(property, useExample)
    }
    return result
  }, {})
}

function uiPropertyLiteralToJson(property: OAProperty, useExample: boolean): any {
  if (useExample) {
    const example = getPropertyExample(property)
    if (example != null) {
      return example
    }

    // Explicit schema default outranks the first enum value.
    if (property.defaultValue !== undefined) {
      return property.defaultValue
    }

    const enumDefault = getEnumDefaultValue(property)
    if (enumDefault !== undefined) {
      return enumDefault
    }
  }

  if (property.constraints?.format === 'binary') {
    return ''
  }

  return getDefaultValueForType(
    property.types[0] ?? 'string',
    property.defaultValue,
    // Format placeholders are sample-oriented (same as examples/enums).
    useExample ? property.constraints?.format as string | undefined : undefined,
  )
}

/**
 * Constants always have an example (the constant), so `useExample` does not apply here.
 */
function uiPropertyConstantToJson(property: OAProperty): any {
  const example = getPropertyExample(property)

  if (example != null) {
    return example
  }

  return getDefaultValueForType(
    property.types[0] ?? 'string',
    property.defaultValue,
    property.constraints?.format as string | undefined,
  )
}

function getEnumDefaultValue(property: OAProperty): unknown {
  if (!property.enum || property.enum.length === 0) {
    return undefined
  }

  const nonNull = property.enum.find(value => value !== null && value !== undefined)
  return nonNull !== undefined ? nonNull : property.enum[0]
}

function getDefaultValueForType(type: string, defaultValue: unknown, format?: string): any {
  if (defaultValue !== undefined) {
    return defaultValue
  }

  switch (type) {
    case 'string':
      return getDefaultStringForFormat(format)
    case 'number':
    case 'integer':
      return 0
    case 'float':
      return 0.0
    case 'boolean':
      return true
    case 'null':
      return null
    case 'array':
      return []
    case 'object':
      return {}
    default:
      return undefined
  }
}

function getDefaultStringForFormat(format?: string): string {
  switch (format) {
    case 'date-time':
      return '2024-01-01T00:00:00Z'
    case 'date':
      return '2024-01-01'
    case 'time':
      return '00:00:00'
    case 'uuid':
      return '123e4567-e89b-12d3-a456-426614174000'
    case 'email':
      return 'user@example.com'
    case 'uri':
    case 'url':
      return 'https://example.com'
    case 'binary':
      return ''
    default:
      return 'string'
  }
}

function isSingleType(property: OAProperty, type: string): boolean {
  return property.types?.length === 1 && property.types[0] === type
}

function isLiteralType(property: OAProperty): boolean {
  return property.types?.length === 1 && property.types[0] != null && literalTypes.includes(property.types[0])
}

function hasAllLiteralTypes(property: OAProperty): boolean {
  return property.types?.every(type => type && literalTypes.includes(type))
}

function containsType(property: OAProperty, type: JSONSchemaType): boolean {
  return property.types?.includes(type) ?? false
}

function isOneOfProperty(property: OAProperty): boolean {
  return !!property.meta?.isOneOf && Array.isArray(property.properties)
}

function isAnyOfProperty(property: OAProperty): boolean {
  return !!property.meta?.isAnyOf && Array.isArray(property.properties)
}

function isUnionProperty(property: OAProperty): boolean {
  return isOneOfProperty(property) || isAnyOfProperty(property)
}

function resolveUnionProperty(property: OAProperty, useExample: boolean): any {
  // Parent-level example/default on the anyOf/oneOf node win over member fallbacks.
  if (useExample) {
    const example = getPropertyExample(property)
    if (example != null) {
      return example
    }
  }

  if (property.defaultValue !== undefined) {
    return property.defaultValue
  }

  if (property.properties && property.properties.length > 0) {
    const preferred
      = property.properties.find(member => !isSingleType(member, 'null'))
        ?? property.properties[0]
    return uiPropertyToJson(preferred, useExample)
  }

  if (useExample) {
    const enumDefault = getEnumDefaultValue(property)
    if (enumDefault !== undefined) {
      return enumDefault
    }
  }

  return getDefaultValueForType(
    property.types.find(type => type !== 'null') ?? property.types[0] ?? 'string',
    property.defaultValue,
    useExample ? property.constraints?.format as string | undefined : undefined,
  )
}
