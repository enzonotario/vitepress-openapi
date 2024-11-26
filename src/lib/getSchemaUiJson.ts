import { literalTypes } from '../index'
import { getExample } from './getExample'
import type { OAProperty } from './getSchemaUi'

export function getSchemaUiJson(uiProperties: OAProperty[] | OAProperty, useExample = false): any {
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
    return uiPropertyConstantToJson(property, useExample)
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

  if (isSingleType(property, 'object')) {
    if (isOneOfProperty(property)) {
      // Return the first property of the oneOf array.
      return uiPropertyToJson(property.properties![0], useExample)
    }
    return uiPropertyObjectToJson(property.properties || [], useExample)
  }

  return {}
}

function uiPropertyArrayToJson(property: OAProperty, useExample: boolean): any {
  if (isOneOfProperty(property)) {
    // Return the first property of the oneOf array.
    return [uiPropertyToJson(property.properties![0], useExample)]
  }

  if (property.properties && Array.isArray(property.properties)) {
    return [uiPropertyObjectToJson(property.properties, useExample)]
  }

  if (property.subtype) {
    if (property.subtype === 'object' && property.properties) {
      return [uiPropertyObjectToJson(property.properties as OAProperty[], useExample)]
    }

    return useExample ? [getExample(property) ?? getDefaultValueForType(property.subtype)] : [getDefaultValueForType(property.subtype)]
  }

  return []
}

function uiPropertyObjectToJson(properties: OAProperty[], useExample: boolean): Record<string, any> {
  return properties.reduce((result, property) => {
    if (isSingleType(property, 'array')) {
      // @ts-expect-error: index signature
      result[property.name] = uiPropertyArrayToJson(property, useExample)
    } else {
      // @ts-expect-error: index signature
      result[property.name] = uiPropertyToJson(property, useExample)
    }
    return result
  }, {})
}

function uiPropertyLiteralToJson(property: OAProperty, useExample: boolean): any {
  if (useExample) {
    const example = getExample(property)
    if (example !== null) {
      return example
    }
  }

  return getDefaultValueForType(property.types[0] ?? 'string')
}

function uiPropertyConstantToJson(property: OAProperty, useExample: boolean): any {
  if (useExample) {
    const example = getExample(property)
    if (example !== null) {
      return example
    }
  }

  return property.types[0] ?? 'string'
}

function getDefaultValueForType(type: string): any {
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
      return undefined // Fallback para tipos desconocidos
  }
}

function isSingleType(property: OAProperty, type: string): boolean {
  return property.types?.length === 1 && property.types[0] === type
}

function isLiteralType(property: OAProperty): boolean {
  return property.types?.length === 1 && property.types[0] !== null && literalTypes.includes(property.types[0])
}

function hasAllLiteralTypes(property: OAProperty): boolean {
  return property.types?.every(type => type && literalTypes.includes(type))
}

function isOneOfProperty(property: OAProperty): boolean {
  return !!property.meta?.isOneOf && Array.isArray(property.properties)
}
