import { OpenApi } from 'vitepress-openapi'
import { transformSpec } from '../lib/transformSpec'
import type { OpenAPI } from './useOpenapi'

export function usePaths({
  spec,
}: {
  spec: OpenAPI
}) {
  const openapi = OpenApi({ spec, transformedSpec: transformSpec(spec) })

  function getTags() {
    return openapi.getFilteredTags()
  }

  return {
    getPathsByVerbs: openapi.getPathsByVerbs,
    getTags,
  }
}
