import type { OpenAPIDocument } from '../types'
import { OpenApi } from '../lib/OpenApi'
import { parseOpenapi } from '../lib/parser/parseOpenapi'

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
    spec: parseOpenapi().transformSync({
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
