import type { OpenAPIDocument } from '../types'
import { openapiInstance } from '../lib/openapiInstance'

export function usePaths({
  spec,
  defaultTag = undefined,
  defaultTagDescription = undefined,
}: {
  spec: OpenAPIDocument
  defaultTag?: string
  defaultTagDescription?: string
}) {
  const openapi = openapiInstance().sync({
    spec,
    defaultTag,
    defaultTagDescription,
  })

  function getTags() {
    return openapi.getFilteredTags()
  }

  return {
    getPathsByVerbs: openapi.getPathsByVerbs,
    getTags,
  }
}
