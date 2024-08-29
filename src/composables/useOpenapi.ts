import { httpVerbs } from 'vitepress-theme-openapi'
import { generateMissingOperationIds } from '../utils/generateMissingOperationIds';
import { dereference } from '@scalar/openapi-parser'

type OpenAPISpec = any

let innerSpec: OpenAPISpec = {}

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    setSpec(spec)
  }

  async function setSpec(value: OpenAPISpec) {
    if (value?.openapi) {
      if (!value.openapi.startsWith('3.')) {
        throw new Error('Only OpenAPI 3.x is supported')
      }
    } else {
      console.warn('Invalid OpenAPI spec, missing `openapi` field, no version specified ')
    }
    if (value?.paths) {
      value = generateMissingOperationIds(value)
    }

    const parsed = await dereference(value)

    innerSpec = parsed.schema
  }

  function getOperation(operationId: string) {
    if (!innerSpec.paths) {
      return null
    }

    for (const path of Object.values(innerSpec.paths)) {
      for (const verb of httpVerbs) {
        if (path[verb]?.operationId === operationId) {
          return path[verb]
        }
      }
    }

    return null
  }

  function getOperationMethod(operationId: string) {
    if (!innerSpec.paths) {
      return null
    }

    for (const path of Object.values(innerSpec.paths)) {
      for (const verb of httpVerbs) {
        if (path[verb]?.operationId === operationId) {
          return verb
        }
      }
    }

    return null
  }

  function getOperationPath(operationId: string) {
    if (!innerSpec.paths) return null

    for (const [path, methods] of Object.entries(innerSpec.paths)) {
      for (const verb of httpVerbs) {
        if (methods[verb]?.operationId === operationId) {
          return path
        }
      }
    }

    return null
  }

  function getOperationParameters(operationId: string) {
    const operation = getOperation(operationId)
    if (!operation) {
      return []
    }
    return operation.parameters || []
  }

  function getBaseUrl() {
    if (!innerSpec.servers || innerSpec.servers.length === 0)
      return ''

    return innerSpec.servers[0].url
  }

  function getSchemas() {
    if (!innerSpec.components || !innerSpec.components.schemas)
      return {}

    return innerSpec.components.schemas
  }

  function getSchemaByName(schemaName: string) {
    return getSchemas()[schemaName] || null
  }

  function getComponents() {
    if (!innerSpec.components)
      return {}

    return innerSpec.components
  }

  function propertiesTypesJson(schema: any, responseType: string) {
    if (!schema?.properties) {
      return JSON.stringify(schema, null, 2)
    }

    return JSON.stringify(
        propertiesTypesJsonRecursive(schema, responseType),
        null,
        2,
    )
  }

  function propertiesTypesJsonRecursive(schema: any, responseType: string) {
    const body: any = {}

    if (!schema.properties) {
      return body
    }

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      if (!property) {
        return
      }

      const { type } = property

      body[key] = type === 'object' ? propertiesTypesJsonRecursive(property, type) : type
    })

    return responseType === 'array' ? [body] : body
  }

  function propertiesAsJson(schema: any, responseType: string) {
    const body: any = {}

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      const { type } = property

      switch (type) {
        case 'string':
          body[key] = 'string'
          break
        case 'number':
        case 'integer':
          body[key] = 0
          break
        case 'boolean':
          body[key] = true
          break
        case 'array':
          body[key] = []
          break
        case 'object':
          body[key] = {}
          break
        default:
          body[key] = null
      }
    })

    return JSON.stringify(responseType === 'array' ? [body] : body, null, 2)
  }

  function getTags(): string[] {
    if (!innerSpec?.paths)
      return []

    return Object.values(innerSpec.paths).reduce((tags, path: any) => {
      for (const verb of httpVerbs) {
        if (path[verb]?.tags) {
          path[verb].tags.forEach((tag: string) => {
            if (!tags.includes(tag)) {
              tags.push(tag)
            }
          })
        }
      }
      return tags
    }, [])
  }

  function getOperationCodeSamples(operationId: string) {
    const operation = getOperation(operationId)
    if (!operation) {
      return []
    }
    return operation['x-codeSamples'] || operation['x-code-samples'] || []
  }

  function getOperationResponses(operationId: string) {
    const operation = getOperation(operationId)
    if (!operation || !operation.responses) {
      return {}
    }
    return operation.responses
  }

  function getOperationRequestBody(operationId: string) {
    const operation = getOperation(operationId)
    if (!operation || !operation.requestBody) {
      return null
    }
    return operation.requestBody
  }

  function getSecuritySchemes() {
    if (!innerSpec.components || !innerSpec.components.securitySchemes)
      return {}

    return innerSpec.components.securitySchemes
  }

  return {
    spec: innerSpec,
    setSpec,
    getOperation,
    getOperationMethod,
    getOperationPath,
    getOperationParameters,
    getBaseUrl,
    getSchemas,
    getSchemaByName,
    getComponents,
    propertiesTypesJson,
    propertiesTypesJsonRecursive,
    propertiesAsJson,
    getTags,
    getOperationCodeSamples,
    getOperationResponses,
    getOperationRequestBody,
    getSecuritySchemes,
  }
}
