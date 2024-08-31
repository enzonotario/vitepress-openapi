import { ref } from 'vue'
import { httpVerbs } from 'vitepress-theme-openapi'
import { generateMissingOperationIds } from '../utils/generateMissingOperationIds';
import { dereference } from '@scalar/openapi-parser'
import type { OpenAPI } from '@scalar/openapi-types'

let json: any = {}

const parsedSpec: OpenAPI = ref(null)

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    setSpec(spec)
  }

  function setSpec(value: OpenAPI) {
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

    json = value

    setParsedSpec(value)
  }

  async function setParsedSpec(value: any) {
    const parsed = await dereference(value)

    parsedSpec.value = parsed.schema
  }

  function findOperation(paths: any, operationId: string) {
    for (const path of Object.values(paths)) {
      for (const verb of httpVerbs) {
        if (path[verb]?.operationId === operationId) {
          return path[verb]
        }
      }
    }
    return null
  }

  function getOperation(operationId: string) {
    if (!json?.paths) {
      return null
    }

    return findOperation(json.paths, operationId)
  }

  function getParsedOperation(operationId: string) {
    if (!parsedSpec.value?.paths) {
      return null
    }

    return findOperation(parsedSpec.value.paths, operationId)
  }

  function getOperationMethod(operationId: string) {
    if (!json?.paths) {
      return null
    }

    for (const path of Object.values(json.paths)) {
      for (const verb of httpVerbs) {
        if (path[verb]?.operationId === operationId) {
          return verb
        }
      }
    }

    return null
  }

  function getOperationPath(operationId: string) {
    if (!json?.paths) {
      return null
    }

    for (const [path, methods] of Object.entries(json.paths)) {
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
    if (!json?.servers || json.servers.length === 0) {
      return ''
    }

    return json.servers[0].url
  }

  function getSecuritySchemes() {
    if (!parsedSpec.value?.components || !parsedSpec.value?.components.securitySchemes) {
      return {}
    }

    return parsedSpec.value.components.securitySchemes
  }

  return {
    spec: parsedSpec,
    json,
    setSpec,
    getOperation,
    getParsedOperation,
    getOperationMethod,
    getOperationPath,
    getOperationParameters,
    getBaseUrl,
    getSecuritySchemes,
  }
}
