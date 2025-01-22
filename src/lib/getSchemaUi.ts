import type { OpenAPI } from '@scalar/openapi-types'
import { literalTypes } from '../index'
import { getPropertyExamples } from './examples/getPropertyExamples'
import { resolveCircularRef } from './resolveCircularRef'
import { getConstraints, hasConstraints } from './constraintsParser'

type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null'

interface Metadata {
  isCircularReference?: boolean
  isAdditionalProperties?: boolean
  isOneOf?: boolean
  isOneOfItem?: boolean
  isConstant?: boolean
  extra?: Record<string, unknown>
}

interface DocumentationReference {
  url?: string
  description?: string
}

export interface OAProperty {
  name: string
  types: JSONSchemaType[]
  required: boolean
  examples?: unknown[]
  title?: string
  description?: string
  defaultValue?: unknown
  docs?: DocumentationReference
  constraints?: Record<string, unknown>
  properties?: OAProperty[]
  enum?: unknown[]
  subtype?: JSONSchemaType
  subexamples?: unknown[]
  nullable?: boolean
  meta?: Metadata
}

class UiPropertyFactory {
  static createBaseProperty(
    name: string,
      property: Partial<OpenAPI.SchemaObject> = {},
      required = false,
  ): OAProperty {
    const nodeTypes = Array.isArray(property.type)
      ? property.type
      : [property.type || 'string'] as JSONSchemaType[]

    const examples = getPropertyExamples(property)

    const baseProperty: OAProperty = {
      name,
      types: nodeTypes,
      required,
      ...(property.title && { title: property.title }),
      ...(property.description && { description: property.description }),
      ...(property.default !== undefined && { defaultValue: property.default }),
      ...(property.externalDocs && { docs: property.externalDocs }),
      ...(examples && { examples }),
      ...(property.nullable && { nullable: property.nullable }),
    }

    if (property.const !== undefined) {
      baseProperty.meta = { ...(baseProperty.meta || {}), isConstant: true }
    }

    if (hasConstraints(property)) {
      baseProperty.constraints = getConstraints(property)
    }

    Object.keys(property).forEach((key) => {
      if (key.startsWith('x-')) {
        baseProperty.meta = baseProperty.meta || {}
        baseProperty.meta.extra = baseProperty.meta.extra || {}
        baseProperty.meta.extra[key] = property[key]
      }
    })

    return baseProperty
  }

  static createCircularReferenceProperty(name: string, circularRef: string): OAProperty {
    return {
      name,
      types: ['object'],
      required: false,
      description: `Circular reference to **${circularRef}**`,
      meta: { isCircularReference: true },
    }
  }

  static createOneOfProperty(oneOfProperties: Partial<OpenAPI.SchemaObject>[], name: string = ''): OAProperty {
    return {
      name,
      types: ['object'],
      required: false,
      properties: oneOfProperties.map((prop) => {
        const property = UiPropertyFactory.schemaToUiProperty('', prop)
        property.meta = { ...(property.meta || {}), isOneOfItem: true }
        return property
      }),
      meta: { isOneOf: true },
    }
  }

  static schemaToUiProperty(
    name: string,
    schema: Partial<OpenAPI.SchemaObject>,
    required = false,
  ): OAProperty {
    if (!schema || Object.keys(schema).length === 0) {
      return {
        name,
        types: [],
        required,
      }
    }

    if (schema.circularReference) {
      return UiPropertyFactory.createCircularReferenceProperty(name, schema.circularReference)
    }

    if (schema.oneOf) {
      return UiPropertyFactory.createOneOfProperty(schema.oneOf, name)
    }

    if (schema.const !== undefined) {
      const example = getPropertyExamples(schema) || schema.const
      return {
        name,
        types: [schema.type as JSONSchemaType || 'string'],
        required: false,
        examples: [example],
        meta: { isConstant: true },
      }
    }

    if (literalTypes.includes(String(schema.type)) && schema.enum) {
      return {
        name,
        types: [schema.type as JSONSchemaType],
        required: false,
        enum: schema.enum,
      }
    }

    const property = UiPropertyFactory.createBaseProperty(name, schema, required)

    switch (schema.type) {
      case 'array':
        if (schema.items) {
          const schemaType = determineSchemaType(schema.items)

          property.properties = schemaType === 'object'
            ? UiPropertyFactory.extractProperties(
                schema.items.properties,
                schema.items.required || [],
                schema.items.additionalProperties,
              )
            : undefined

          if (schemaType !== undefined) {
            property.subtype = schemaType as JSONSchemaType
          }

          const itemsExamples = getPropertyExamples(schema.items)
          if (itemsExamples) {
            property.subexamples = itemsExamples
          }

          if (schema.items.const !== undefined) {
            property.meta = { ...(property.meta || {}), isConstant: true }
          }

          if (schema.items.oneOf) {
            property.meta = { ...(property.meta || {}), isOneOf: true }
            property.properties = schema.items.oneOf.map((prop: any) => {
              const propSchema = { ...prop, type: schema.items.type }
              return {
                ...UiPropertyFactory.schemaToUiProperty('', propSchema),
                meta: { ...(prop.meta || {}), isOneOfItem: true },
              }
            })
          }
        }
        break

      case 'object':
        property.properties = UiPropertyFactory.extractProperties(
          schema.properties,
          schema.required || [],
          schema.additionalProperties,
        )
        break

      case undefined:
        if (schema.properties || schema.additionalProperties) {
          property.types = ['object']
          property.properties = UiPropertyFactory.extractProperties(
            schema.properties,
            schema.required || [],
            schema.additionalProperties,
          )
        }
        break
    }

    return property
  }

  static extractProperties(
    propertiesNode?: Record<string, OpenAPI.SchemaObject>,
    requiredProperties: string[] = [],
    additionalPropertiesNode?: OpenAPI.SchemaObject | boolean,
  ): OAProperty[] {
    const properties: OAProperty[] = []

    if (propertiesNode) {
      Object.entries(propertiesNode).forEach(([key, value]) => {
        const isRequired = requiredProperties.includes(key)
        properties.push(UiPropertyFactory.schemaToUiProperty(key, value, isRequired))
      })
    }

    if (additionalPropertiesNode) {
      const additionalProps = typeof additionalPropertiesNode === 'object'
        ? additionalPropertiesNode
        : { type: 'string' }

      properties.push({
        name: 'additionalProperties',
        types: [additionalProps.type as JSONSchemaType],
        required: false,
        meta: { isAdditionalProperties: true },
      })
    }

    return properties
  }
}

export function getSchemaUi(jsonSchema: OpenAPI.SchemaObject): OAProperty | OAProperty[] {
  if (!jsonSchema || Object.keys(jsonSchema).length === 0) {
    return []
  }

  const resolvedSchema = resolveCircularRef(jsonSchema)

  return UiPropertyFactory.schemaToUiProperty('', resolvedSchema)
}

function determineSchemaType(schema: OpenAPI.SchemaObject): JSONSchemaType {
  if (!schema.type && schema.properties) {
    return 'object'
  }

  if (!schema.type && schema.items) {
    return 'array'
  }

  if (!schema.type && schema.const !== undefined) {
    if (Array.isArray(schema.const)) {
      return 'array'
    } else if (typeof schema.const === 'object' && schema.const !== null) {
      return 'object'
    } else if (typeof schema.const === 'string') {
      return 'string'
    } else if (typeof schema.const === 'number') {
      return 'number'
    } else if (typeof schema.const === 'boolean') {
      return 'boolean'
    } else {
      return 'null'
    }
  }

  return schema.type as JSONSchemaType
}
