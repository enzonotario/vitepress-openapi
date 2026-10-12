import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OpenAPIDocument, ParsedOpenAPI, ParsedPaths } from '../../types'
import { httpVerbs } from '../../index'

export interface OpenApiSpecInstance {
  spec: OpenAPIDocument
  originalSpec: OpenAPIDocument | null
  getSpec: () => OpenAPIDocument
  setSpec: (spec: OpenAPIDocument) => void
  getOriginalSpec: () => OpenAPIDocument | null
  setOriginalSpec: (spec: OpenAPIDocument | null) => void
  getOperation: (operationId: string) => any | null
  getOperationPath: (operationId: string) => string | null
  getOperationMethod: (operationId: string) => string | null
  getOperationParameters: (operationId: string) => any[]
  getPaths: () => ParsedPaths
  getPathsByVerbs: () => any[]
  getInfo: () => any
  getExternalDocs: () => any
  getServers: () => any[]
  getOperationServers: (operationId: string) => OpenAPIV3.ServerObject[]
  getOperationsTags: () => string[]
  getPathsByTags: (tags: string | string[]) => OpenAPIV3.PathsObject
  getPathsWithoutTags: () => OpenAPIV3.PathsObject
  getTags: () => { name: string | null, description: string | null }[]
  getFilteredTags: () => { name: string | null, description: string | null }[]
}

export function createOpenApiSpec(options: {
  spec?: ParsedOpenAPI | OpenAPIDocument | null
  originalSpec?: OpenAPIDocument | null
} = {}): OpenApiSpecInstance {
  let innerSpec: OpenAPIDocument | null = null
  let innerOriginalSpec: OpenAPIDocument | null = options.originalSpec ?? null
  // operationId -> location, built on first lookup so repeated lookups (one per
  // rendered operation, per operation link) don't rescan every path and verb.
  let operationIndex: Map<string, { path: string, method: string, operation: any }> | null = null

  function setSpec(spec: OpenAPIDocument) {
    innerSpec = spec
    operationIndex = null
  }

  function getSpec(): OpenAPIDocument {
    if (!innerSpec) {
      setSpec((options.spec ?? {}) as OpenAPIDocument)
    }
    if (!innerSpec) {
      throw new Error('OpenAPI spec is not defined')
    }
    return innerSpec
  }

  function getOriginalSpec(): OpenAPIDocument | null {
    return innerOriginalSpec
  }

  function setOriginalSpec(spec: OpenAPIDocument | null) {
    innerOriginalSpec = spec
  }

  function findOperation(operationId: string) {
    if (!operationIndex) {
      operationIndex = new Map()
      for (const [path, methods] of Object.entries(getPaths())) {
        for (const verb of httpVerbs) {
          const operation = methods?.[verb]
          // First match wins, like the linear scan this replaces.
          if (operation?.operationId !== undefined && !operationIndex.has(operation.operationId)) {
            operationIndex.set(operation.operationId, { path, method: verb, operation })
          }
        }
      }
    }
    return operationIndex.get(operationId) ?? null
  }

  function getOperation(operationId: string) {
    return findOperation(operationId)?.operation ?? null
  }

  function getOperationPath(operationId: string) {
    return findOperation(operationId)?.path ?? null
  }

  function getOperationMethod(operationId: string) {
    return findOperation(operationId)?.method ?? null
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
            const { operationId, summary, description, tags } = paths[path][verb]
            return {
              path,
              verb,
              operationId,
              summary,
              description,
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

  function getOperationServers(operationId: string): OpenAPIV3.ServerObject[] {
    const entry = findOperation(operationId)
    if (!entry) {
      return []
    }
    const operation = entry.operation
    const pathServers = getPaths()[entry.path]?.servers

    if (operation?.servers !== undefined) {
      return operation.servers as OpenAPIV3.ServerObject[]
    }
    if (pathServers !== undefined) {
      return pathServers as OpenAPIV3.ServerObject[]
    }
    return getSpec().servers ?? []
  }

  function getOperationsTags(): string[] {
    if (!getSpec().paths) {
      return []
    }
    const tags = new Set<string>()
    for (const path of Object.values(getPaths())) {
      for (const verb of httpVerbs) {
        path?.[verb]?.tags?.forEach((tag: string) => tags.add(tag))
      }
    }
    return [...tags]
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
    return [...tags, ...[
      ...operationsTags
        .filter(tag => !tags.map(tag => tag.name).includes(tag))
        .map(tag => ({
          name: tag,
          description: null,
        })),
    ]]
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
