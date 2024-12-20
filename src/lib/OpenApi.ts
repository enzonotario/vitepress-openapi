import type { OpenAPIV3 } from '@scalar/openapi-types'
import { httpVerbs } from '../index'
import type { ParsedOpenAPI } from '../types'
import { processOpenAPI } from './processOpenAPI'

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
  function findOperation(paths: OpenAPIV3.PathsObject, operationId: string) {
    for (const path of Object.values(paths)) {
      for (const verb of httpVerbs) {
        if (path && path[verb]?.operationId === operationId) {
          return path[verb]
        }
      }
    }
    return null
  }

  function getSpec(): ParsedOpenAPI {
    return parsedSpec ?? transformedSpec ?? spec ?? {}
  }

  function getParsedSpec() {
    if (!parsedSpec) {
      parsedSpec = processOpenAPI(transformedSpec ?? spec)
    }

    return parsedSpec
  }

  function getOperation(operationId: string) {
    if (!getSpec().paths) {
      return null
    }

    return findOperation(getSpec().paths, operationId)
  }

  function getOperationPath(operationId: string) {
    if (!getSpec().paths) {
      return null
    }

    for (const [path, methods] of Object.entries(getSpec().paths)) {
      for (const verb of httpVerbs) {
        if (methods[verb]?.operationId === operationId) {
          return path
        }
      }
    }

    return null
  }

  function getOperationMethod(operationId: string) {
    if (!getSpec().paths) {
      return null
    }

    for (const path of Object.values(getSpec().paths)) {
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

    if (operation?.security) {
      return operation.security
    }

    if (getParsedSpec()?.security) {
      return getParsedSpec().security
    }

    return {}
  }

  function getParsedOperation(operationId: string) {
    if (!getParsedSpec()?.paths) {
      return null
    }

    return findOperation(getParsedSpec().paths, operationId)
  }

  function getPaths(): OpenAPIV3.PathsObject {
    return getSpec().paths ?? {}
  }

  function getPathsByVerbs() {
    const paths = getPaths()

    return Object.keys(paths)
      .flatMap((path) => {
        return httpVerbs
          .filter((verb: string) => paths && paths[path] && paths[path][verb])
          .map((verb: string) => {
            if (!paths || !paths[path] || !paths[path][verb]) {
              return null
            }

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
    return getSpec().info ?? {}
  }

  function getExternalDocs() {
    return getSpec().externalDocs ?? {}
  }

  function getServers() {
    return getSpec().servers ?? []
  }

  function getOperationServers(operationId: string) {
    const operation = findOperation(getPaths(), operationId)

    if (!operation) {
      return []
    }

    const operationPath = getOperationPath(operationId)

    const pathServers = getSpec().paths[(operationPath ?? '')]?.servers

    return [
      ...(operation?.servers ?? []),
      ...(pathServers ?? []),
      ...(getSpec().servers ?? []),
    ]
  }

  function getOperationsTags(): string[] {
    if (!getSpec().paths) {
      return []
    }

    return Object.values(getSpec().paths).reduce((tags: string[], path) => {
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
    const output: OpenAPIV3.PathsObject = {}

    for (const [path, methods] of Object.entries(paths)) {
      if (!methods) {
        continue
      }

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
    return filterPaths(operation => operation?.tags?.some((tag: string) => tagList.includes(tag)))
  }

  function getPathsWithoutTags() {
    return filterPaths(operation => !operation?.tags || operation.tags.length === 0)
  }

  function getTags() {
    return (getSpec().tags ?? [])
      .map((tag: OpenAPIV3.TagObject) => ({
        name: tag.name ?? null,
        description: tag.description ?? null,
      }))
  }

  function getFilteredTags(): OpenAPIV3.TagObject[] {
    const operationsTags = getOperationsTags()

    const tags = getTags()
      .filter((tag: OpenAPIV3.TagObject) => operationsTags.includes(tag.name ?? ''))

    return tags
      .concat([
        ...operationsTags
          .filter(tag => !tags.map((tag: OpenAPIV3.TagObject) => tag.name).includes(tag))
          .map(tag => ({
            name: tag,
            description: null,
          })),
      ])
  }

  return {
    spec: getSpec(),
    transformedSpec,
    parsedSpec,
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
    getOperationServers,
    getOperationsTags,
    getPathsByTags,
    getPathsWithoutTags,
    getTags,
    getFilteredTags,
  }
}
