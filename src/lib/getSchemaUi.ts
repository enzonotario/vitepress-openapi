import type { OpenAPI } from '@scalar/openapi-types'
import { literalTypes } from '../index'
import { getExamples } from './getExamples'
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

    const baseProperty: OAProperty = {
      name,
      types: nodeTypes,
      required,
      ...(property.title && { title: property.title }),
      ...(property.description && { description: property.description }),
      ...(property.default !== undefined && { defaultValue: property.default }),
      ...(property.externalDocs && { docs: property.externalDocs }),
      ...(getExamples(property) && { examples: getExamples(property) }),
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
        const property = this.schemaToUiProperty('', prop)
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
      return { name: '', types: [], required: false }
    }

    if (schema.circularReference) {
      return this.createCircularReferenceProperty(name, schema.circularReference)
    }

    if (schema.oneOf) {
      return this.createOneOfProperty(schema.oneOf, name)
    }

    if (schema.const !== undefined) {
      const example = getExamples(schema) || schema.const
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

    const property = this.createBaseProperty(name, schema, required)

    switch (schema.type) {
      case 'array':
        if (schema.items) {
          property.properties = schema.items.type === 'object'
            ? this.extractProperties(
              schema.items.properties,
              schema.items.required || [],
              schema.items.additionalProperties,
            )
            : undefined

          if (schema.items.type) {
            property.subtype = schema.items.type as JSONSchemaType
          }

          if (getExamples(schema.items)) {
            property.subexamples = getExamples(schema.items)
          }

          if (schema.items.oneOf) {
            property.meta = { isOneOf: true }
            property.properties = schema.items.oneOf.map((prop) => {
              const propSchema = { ...prop, type: schema.items.type }
              return {
                ...this.schemaToUiProperty('', propSchema),
                meta: { isOneOfItem: true },
              }
            })
          }
        }
        break

      case 'object':
        property.properties = this.extractProperties(
          schema.properties,
          schema.required || [],
          schema.additionalProperties,
        )
        break

      case undefined:
        if (schema.properties || schema.additionalProperties) {
          property.types = ['object']
          property.properties = this.extractProperties(
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
        properties.push(this.schemaToUiProperty(key, value, isRequired))
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
