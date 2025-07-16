import type { OpenAPI } from '@scalar/openapi-types'
import { getPropertyExamples } from '../examples/getPropertyExamples'
import { getConstraints, hasConstraints } from './constraintsParser'
import { resolveCircularRef } from './resolveCircularRef'

export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null'

interface Metadata {
  isCircularReference?: boolean
  isAdditionalProperties?: boolean
  isOneOf?: boolean
  isOneOfItem?: boolean
  isAnyOf?: boolean
  isAnyOfItem?: boolean
  isConstant?: boolean
  isPrefixItem?: boolean
  prefixItemIndex?: number
  hasPrefixItems?: boolean
  isAdditionalItems?: boolean
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
  items?: OAProperty
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

  static createUnionProperty(
    unionProperties: Partial<OpenAPI.SchemaObject>[],
    unionType: 'oneOf' | 'anyOf',
    name: string = '',
    baseSchema: Partial<OpenAPI.SchemaObject> = {},
    required = false,
  ): OAProperty {
    const baseProperty = UiPropertyFactory.createBaseProperty(
      name,
      baseSchema,
      required,
    )

    const unionTypes = Array.from(
      new Set(
        unionProperties
          .map(prop => determineSchemaType(prop as OpenAPI.SchemaObject))
          .filter(Boolean),
      ),
    ) as JSONSchemaType[]

    if (unionTypes.length > 0) {
      baseProperty.types = unionTypes
    }

    const isOneOf = unionType === 'oneOf'
    const metaItemKey = isOneOf ? 'isOneOfItem' : 'isAnyOfItem'
    const metaKey = isOneOf ? 'isOneOf' : 'isAnyOf'

    baseProperty.properties = unionProperties.map((prop) => {
      const property = UiPropertyFactory.schemaToUiProperty('', prop)
      property.meta = { ...(property.meta || {}), [metaItemKey]: true }
      return property
    })

    baseProperty.meta = { ...(baseProperty.meta || {}), [metaKey]: true }

    return baseProperty
  }

  static createOneOfProperty(
    oneOfProperties: Partial<OpenAPI.SchemaObject>[],
    name: string = '',
    baseSchema: Partial<OpenAPI.SchemaObject> = {},
    required = false,
  ): OAProperty {
    return UiPropertyFactory.createUnionProperty(oneOfProperties, 'oneOf', name, baseSchema, required)
  }

  static createAnyOfProperty(
    anyOfProperties: Partial<OpenAPI.SchemaObject>[],
    name: string = '',
    baseSchema: Partial<OpenAPI.SchemaObject> = {},
    required = false,
  ): OAProperty {
    return UiPropertyFactory.createUnionProperty(anyOfProperties, 'anyOf', name, baseSchema, required)
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
      return UiPropertyFactory.createOneOfProperty(schema.oneOf, name, schema, required)
    }

    if (schema.anyOf) {
      return UiPropertyFactory.createAnyOfProperty(schema.anyOf, name, schema, required)
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

    if (schema.enum) {
      let types: JSONSchemaType[] = []

      if (schema.type) {
        types = Array.isArray(schema.type)
          ? schema.type as JSONSchemaType[]
          : [schema.type as JSONSchemaType]
      } else {
        types = inferTypesFromEnum(schema.enum)
      }

      if (types.length === 0) {
        types = ['string']
      }

      const property = UiPropertyFactory.createBaseProperty(name, schema, required)
      property.enum = schema.enum
      property.types = types
      return property
    }

    const property = UiPropertyFactory.createBaseProperty(name, schema, required)

    if (Array.isArray(schema.type) ? schema.type.includes('array') : schema.type === 'array') {
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

        if (schema.items.oneOf || schema.items.anyOf) {
          const isOneOf = !!schema.items.oneOf
          const unionProperties = isOneOf ? schema.items.oneOf : schema.items.anyOf
          const metaKey = isOneOf ? 'isOneOf' : 'isAnyOf'
          const metaItemKey = isOneOf ? 'isOneOfItem' : 'isAnyOfItem'

          property.meta = { ...(property.meta || {}), [metaKey]: true }
          property.properties = unionProperties.map((prop: any) => {
            const propSchema = { ...prop, type: schema.items.type }
            return {
              ...UiPropertyFactory.schemaToUiProperty('', propSchema),
              meta: { ...(prop.meta || {}), [metaItemKey]: true },
            }
          })
        }

        // store primitive item details
        if (
          schemaType !== 'object'
          && schemaType !== 'array'
          && !schema.items.oneOf
          && !schema.items.anyOf
        ) {
          const itemProperty = UiPropertyFactory.schemaToUiProperty('[item]', schema.items)
          if (
            itemProperty.description
            || itemProperty.enum
            || itemProperty.constraints
            || itemProperty.docs
          ) {
            property.items = itemProperty
          }
        }
      }

      if (schema.prefixItems && Array.isArray(schema.prefixItems)) {
        property.properties = schema.prefixItems.map((prefixItem, index) => {
          const prefixItemProperty = UiPropertyFactory.schemaToUiProperty(
            `[${index}]`,
            prefixItem,
            false,
          )

          prefixItemProperty.meta = {
            ...(prefixItemProperty.meta || {}),
            isPrefixItem: true,
            prefixItemIndex: index,
          }

          return prefixItemProperty
        })

        property.meta = {
          ...(property.meta || {}),
          hasPrefixItems: true,
        }
      }

      // Handle case when both prefixItems and items are present.
      if (schema.prefixItems && Array.isArray(schema.prefixItems) && schema.items) {
        const additionalItemsProperty = UiPropertyFactory.schemaToUiProperty(
          '[n+]', // Name indicating "additional items".
          schema.items,
          false,
        )

        additionalItemsProperty.meta = {
          ...(additionalItemsProperty.meta || {}),
          isAdditionalItems: true,
        }

        property.properties = [
          ...(property.properties || []),
          additionalItemsProperty,
        ]

        // Don't set subtype when we have prefixItems.
        property.subtype = undefined
      }
    } else if (Array.isArray(schema.type) ? schema.type.includes('object') : schema.type === 'object') {
      property.properties = UiPropertyFactory.extractProperties(
        schema.properties,
        schema.required || [],
        schema.additionalProperties,
      )
    } else if (schema.type === undefined) {
      if (schema.properties || schema.additionalProperties) {
        property.types = ['object']
        property.properties = UiPropertyFactory.extractProperties(
          schema.properties,
          schema.required || [],
          schema.additionalProperties,
        )
      }
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

function inferTypesFromEnum(values: unknown[]): JSONSchemaType[] {
  const types = new Set<JSONSchemaType>()

  values.forEach((value) => {
    if (value === null) {
      types.add('null')
    } else if (Array.isArray(value)) {
      types.add('array')
    } else if (typeof value === 'object') {
      types.add('object')
    } else if (typeof value === 'string') {
      types.add('string')
    } else if (typeof value === 'boolean') {
      types.add('boolean')
    } else if (typeof value === 'number') {
      types.add(Number.isInteger(value) ? 'integer' : 'number')
    }
  })

  if (types.has('number')) {
    types.delete('integer')
  }

  return Array.from(types)
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
