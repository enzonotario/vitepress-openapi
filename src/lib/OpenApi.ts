import { httpVerbs } from 'vitepress-openapi'
import { parseSpec } from './parseSpec'

const DEFAULT_SERVER_URL = 'http://localhost'

export function OpenApi({
  spec,
  parsedSpec,
  transformedSpec,
}: {
  spec: any
  transformedSpec?: any
  parsedSpec?: any
} = {
  spec: null,
  transformedSpec: null,
  parsedSpec: null,
}) {
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
      parsedSpec = parseSpec(transformedSpec ?? spec)
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

            const isValid = new URL(firstUrl)
            if (!isValid) {
              throw new Error('Invalid URL')
            }

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

      const isValid = new URL(firstUrl)
      if (!isValid) {
        throw new Error('Invalid URL')
      }

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

    const securitySchemes = getParsedSpec().components?.securitySchemes ?? {}

    if (operation?.security) {
      const output = {}

      Object.entries(securitySchemes)
        .filter(([key]) => operation.security.some(security => security[key]))
        .forEach(([key, value]) => {
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
    return spec?.paths ?? {}
  }

  function getPathsByVerbs() {
    const paths = getPaths()

    return Object.keys(paths)
      .flatMap((path) => {
        return httpVerbs
          .filter(verb => paths[path][verb])
          .map((verb) => {
            const { operationId, summary, tags } = paths[path][verb]

            return {
              path,
              verb,
              operationId,
              summary,
              tags: tags ?? [],
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

  function getOperationsTags() {
    if (!spec?.paths) {
      return []
    }

    return Object.values(spec.paths).reduce((tags, path: any) => {
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

  function filterPaths(predicate: (operation: any) => boolean) {
    const paths = getPaths() ?? {}
    const output = {}

    for (const [path, methods] of Object.entries(paths)) {
      for (const verb of httpVerbs) {
        const operation = methods[verb]
        if (operation && predicate(operation)) {
          output[path] = output[path] || {}
          output[path][verb] = operation
        }
      }
    }

    return output
  }

  function getPathsByTags(tags: string | string[]) {
    const tagList = typeof tags === 'string' ? [tags] : tags
    return filterPaths(operation => operation?.tags?.some(tag => tagList.includes(tag)))
  }

  function getPathsWithoutTags() {
    return filterPaths(operation => !operation?.tags || operation.tags.length === 0)
  }

  function getTags() {
    return (spec?.tags ?? [])
      .map(({ name, description }) => ({
        name: name ?? null,
        description: description ?? null,
      }))
  }

  function getFilteredTags() {
    const operationsTags = getOperationsTags()

    const tags = getTags()
      .filter(({ name }) => operationsTags.includes(name))

    return tags
      .concat([
        ...operationsTags
          .filter(tag => !tags.map(({ name }) => name).includes(tag))
          .map(tag => ({
            name: tag,
            description: null,
          })),
      ])
  }

  return {
    spec: parsedSpec ?? transformedSpec ?? spec,
    transformedSpec,
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
    getOperationsTags,
    getPathsByTags,
    getPathsWithoutTags,
    getTags,
    getFilteredTags,
  }
}
