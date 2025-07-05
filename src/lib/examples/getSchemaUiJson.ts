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

  if (isOneOfProperty(property)) {
    return resolveOneOfProperty(property, useExample)
  }

  if (isAnyOfProperty(property)) {
    return resolveAnyOfProperty(property, useExample)
  }

  if (containsType(property, 'object')) {
    return uiPropertyObjectToJson(property.properties || [], useExample)
  }

  return getDefaultValueForType(property.types[0] ?? 'string', property.defaultValue)
}

function uiPropertyArrayToJson(property: OAProperty, useExample: boolean): any {
  if (isOneOfProperty(property)) {
    return [resolveOneOfProperty(property, useExample)]
  }
  if (isAnyOfProperty(property)) {
    return [resolveAnyOfProperty(property, useExample)]
  }

  if (property.meta?.hasPrefixItems && property.properties && Array.isArray(property.properties)) {
    return property.properties.map((prop) => {
      return uiPropertyToJson(prop, useExample)
    })
  }

  if (property.properties && Array.isArray(property.properties)) {
    return [uiPropertyObjectToJson(property.properties, useExample)]
  }

  if (property.subtype) {
    if (property.subtype === 'object' && property.properties) {
      return [uiPropertyObjectToJson(property.properties as OAProperty[], useExample)]
    }

    return useExample ? [getPropertyExample(property) ?? getDefaultValueForType(property.subtype, property.defaultValue)] : [getDefaultValueForType(property.subtype, property.defaultValue)]
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
  }

  if (property.constraints?.format === 'binary') {
    return ''
  }

  return getDefaultValueForType(property.types[0] ?? 'string', property.defaultValue)
}

/**
 * Constants always have an example (the constant), so `useExample` does not apply here.
 */
function uiPropertyConstantToJson(property: OAProperty): any {
  const example = getPropertyExample(property)

  if (example != null) {
    return example
  }

  return getDefaultValueForType(property.types[0] ?? 'string', property.defaultValue)
}

function getDefaultValueForType(type: string, defaultValue: unknown): any {
  if (defaultValue !== undefined) {
    return defaultValue
  }

  switch (type) {
    case 'string':
      return 'string'
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

function resolveOneOfProperty(property: OAProperty, useExample: boolean): any {
  if (property.properties && property.properties.length > 0) {
    return uiPropertyToJson(property.properties[0], useExample)
  } else {
    return useExample ? getPropertyExample(property) : getDefaultValueForType(property.types[0] ?? 'string', property.defaultValue)
  }
}

function resolveAnyOfProperty(property: OAProperty, useExample: boolean): any {
  if (property.properties && property.properties.length > 0) {
    return uiPropertyToJson(property.properties[0], useExample)
  } else {
    return useExample ? getPropertyExample(property) : getDefaultValueForType(property.types[0] ?? 'string', property.defaultValue)
  }
}
