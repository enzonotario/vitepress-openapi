import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OpenAPIDocument, ParsedOpenAPI, ParsedPaths } from '../types'
import { httpVerbs } from '../index'

export function OpenApi({
  spec,
  originalSpec,
}: {
  spec: ParsedOpenAPI | OpenAPIDocument | null
  originalSpec?: OpenAPIDocument | null
} = {
  spec: null,
  originalSpec: null,
}) {
  let innerSpec: OpenAPIDocument | null = null
  let innerOriginalSpec: OpenAPIDocument | null = originalSpec ?? null

  function setSpec(spec: any) {
    innerSpec = spec
  }

  function getOriginalSpec(): OpenAPIDocument | null {
    return innerOriginalSpec
  }

  function setOriginalSpec(spec: OpenAPIDocument | null) {
    innerOriginalSpec = spec
  }

  function getSpec(): OpenAPIDocument {
    if (!innerSpec) {
      setSpec(spec ?? {})
    }

    if (!innerSpec) {
      throw new Error('OpenAPI spec is not defined')
    }

    return innerSpec
  }

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

  function getOperation(operationId: string) {
    const paths = getSpec().paths as OpenAPIV3.PathsObject

    if (!paths) {
      return null
    }

    return findOperation(paths, operationId)
  }

  function getOperationPath(operationId: string) {
    const paths = getSpec().paths as OpenAPIV3.PathsObject

    if (!paths) {
      return null
    }

    for (const [path, methods] of Object.entries(paths)) {
      for (const verb of httpVerbs) {
        if (methods && methods[verb]?.operationId === operationId) {
          return path
        }
      }
    }

    return null
  }

  function getOperationMethod(operationId: string) {
    const paths = getSpec().paths as OpenAPIV3.PathsObject

    if (!paths) {
      return null
    }

    for (const path of Object.values(paths)) {
      for (const verb of httpVerbs) {
        if (path && path[verb]?.operationId === operationId) {
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

  function getPaths(): ParsedPaths {
    return (getSpec().paths ?? {}) as ParsedPaths
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

    const paths = getSpec().paths as OpenAPIV3.PathsObject

    const pathServers = paths[(operationPath ?? '')]?.servers

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

    const paths = getSpec().paths as OpenAPIV3.PathsObject

    return Object.values(paths).reduce((tags: string[], path) => {
      for (const verb of httpVerbs) {
        if (path && path[verb]?.tags) {
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
      .map(tag => ({
        name: tag.name ?? null,
        description: tag.description ?? null,
      }))
  }

  function getFilteredTags() {
    const operationsTags = getOperationsTags()

    const tags = getTags()
      .filter(tag => operationsTags.includes(tag.name ?? ''))

    return tags
      .concat([
        ...operationsTags
          .filter(tag => !tags.map(tag => tag.name).includes(tag))
          .map(tag => ({
            name: tag,
            description: null,
          })),
      ])
  }

  return {
    spec: getSpec(),
    originalSpec: getOriginalSpec(),
    setSpec,
    getSpec,
    getOriginalSpec,
    setOriginalSpec,
    getOperation,
    getOperationPath,
    getOperationMethod,
    getOperationParameters,
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
