import type { OpenAPI } from '@scalar/openapi-types'
import { OpenApi } from '../lib/OpenApi'
import { prepareOpenAPI } from '../lib/prepareOpenAPI'

export function usePaths({
  spec,
}: {
  spec: OpenAPI.Document
}) {
  const openapi = OpenApi({ spec, transformedSpec: prepareOpenAPI(spec) })

  function getTags() {
    return openapi.getFilteredTags()
  }

  return {
    getPathsByVerbs: openapi.getPathsByVerbs,
    getTags,
  }
}
