import { httpVerbs } from 'vitepress-theme-openapi'
import { dereferenceSync } from '@trojs/openapi-dereference'
import { merge } from 'allof-merge'
import { generateMissingOperationIds } from './generateMissingOperationIds'
import { generateMissingSummary } from './generateMissingSummary'

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

  function getBaseUrl(operationId?: string) {
    if (operationId) {
      const operationPath = getOperationPath(operationId)
      if (operationPath) {
        const pathServers = spec.paths[operationPath]?.servers
        if (pathServers && pathServers.length > 0) {
          try {
            const firstUrl = pathServers[0].url
            new URL(firstUrl)
            return firstUrl
          } catch {
            console.warn('Invalid server URL in path servers:', pathServers)
          }
        }
      }
    }

    if (!spec?.servers || spec.servers.length === 0) {
      return DEFAULT_SERVER_URL
    }

    try {
      const firstUrl = spec.servers[0].url

      new URL(firstUrl)

      return firstUrl
    } catch {
      console.warn('Invalid server URL:', spec.servers)
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
    const operation = findOperation(getParsedSpec().paths, operationId)

    const securitySchemes = getParsedSpec().components?.securitySchemes

    if (operation?.security) {
      const output = {}

      Object.entries(securitySchemes)
        .filter(([key]) => operation.security.some(security => security[key]))
        .map(([key, value]) => {
          output[key] = value
        })

      return output
    }

    if (getParsedSpec()?.security) {
      return securitySchemes
    }

    return {}
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
          .filter(verb => getPaths()[path][verb])
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

  function getInfo() {
    return spec?.info ?? {}
  }

  function getExternalDocs() {
    return spec?.externalDocs ?? {}
  }

  function getServers() {
    return spec?.servers ?? []
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
    getInfo,
    getExternalDocs,
    getServers,
  }
}
