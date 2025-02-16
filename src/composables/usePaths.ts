import type { OpenAPIDocument } from '../types'
import { OpenApi } from '../lib/OpenApi'
import { prepareOpenAPI } from '../lib/prepareOpenAPI/prepareOpenAPI'

export function usePaths({
  spec,
  defaultTag = undefined,
  defaultTagDescription = undefined,
}: {
  spec: OpenAPIDocument
  defaultTag?: string
  defaultTagDescription?: string
}) {
  const openapi = OpenApi({
    spec,
    transformedSpec: prepareOpenAPI({
      spec,
      defaultTag,
      defaultTagDescription,
    }),
  })

  function getTags() {
    return openapi.getFilteredTags()
  }

  return {
    getPathsByVerbs: openapi.getPathsByVerbs,
    getTags,
  }
}
