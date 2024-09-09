import { httpVerbs } from 'vitepress-theme-openapi'
import { dereferenceSync } from '@trojs/openapi-dereference';
import { merge } from 'allof-merge'
import { generateMissingOperationIds } from './generateMissingOperationIds';
import { generateMissingSummary } from './generateMissingSummary';

const DEFAULT_SERVER_URL = 'http://localhost'

export function OpenApi({ spec }: { spec: any } = { spec: null }) {
  let parsedSpec: any = null

  transformSpec()

  function transformSpec() {
    if (!spec) {
      return
    }

    if (!spec.openapi || !spec.openapi.startsWith('3.')) {
      throw new Error('Only OpenAPI 3.x is supported')
    }

    if (spec?.paths) {
      spec = generateMissingOperationIds(spec)
      spec = generateMissingSummary(spec)
    }
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

  function getParsedSpec() {
    if (!parsedSpec) {
      parsedSpec = dereferenceSync(merge(spec))
    }

    return parsedSpec
  }

  function getBaseUrl() {
    if (!spec?.servers || spec.servers.length === 0) {
      return DEFAULT_SERVER_URL
    }

    try {
      const firstUrl = spec.servers[0].url

      new URL(firstUrl)

      return firstUrl
    } catch {
      console.warn('Invalid server URL:', firstUrl)
      return DEFAULT_SERVER_URL
    }
  }

  function getOperation(operationId: string) {
    if (!spec?.paths) {
      return null
    }

    return findOperation(spec.paths, operationId)
  }

  function getOperationPath(operationId: string) {
    if (!spec?.paths) {
      return null
    }

    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const verb of httpVerbs) {
        if (methods[verb]?.operationId === operationId) {
          return path
        }
      }
    }

    return null
  }

  function getOperationMethod(operationId: string) {
    if (!spec?.paths) {
      return null
    }

    for (const path of Object.values(spec.paths)) {
      for (const verb of httpVerbs) {
        if (path[verb]?.operationId === operationId) {
          return verb
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

  function getSecuritySchemes(operationId: string) {
    if (operationId && getParsedSpec()?.paths) {
      const operation = findOperation(getParsedSpec().paths, operationId)

      if (operation && operation.security) {
        return operation.security
      }
    }

    if (!getParsedSpec()?.components || !getParsedSpec()?.components?.securitySchemes) {
      return {}
    }

    return getParsedSpec().components.securitySchemes
  }

  function getParsedOperation(operationId: string) {
    if (!getParsedSpec()?.paths) {
      return null
    }

    return findOperation(getParsedSpec().paths, operationId)
  }

  function getPaths() {
    return spec?.paths
  }

  function getPathsByVerbs() {
    if (!getPaths()) {
      return []
    }

    return Object.keys(getPaths())
      .flatMap((path) => {
        return httpVerbs
          .filter((verb) => getPaths()[path][verb])
          .map((verb) => {
            const { operationId, summary } = getPaths()[path][verb]

            return {
              path,
              verb,
              operationId,
              summary,
            }
          })
      })
  }

  return {
    spec,
    parsedSpec,
    getBaseUrl,
    getOperation,
    getOperationPath,
    getOperationMethod,
    getOperationParameters,
    getSecuritySchemes,
    getParsedOperation,
    getParsedSpec,
    getPaths,
    getPathsByVerbs,
  }
}
