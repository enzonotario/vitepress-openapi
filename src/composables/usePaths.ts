import type { OpenAPIDocument } from '../types'
import { parseOpenapi } from '../lib/parser/parseOpenapi'
import { createOpenApiSpec } from '../lib/spec/createOpenApiSpec'

export function usePaths({
  spec,
  defaultTag = undefined,
  defaultTagDescription = undefined,
}: {
  spec: OpenAPIDocument
  defaultTag?: string
  defaultTagDescription?: string
}) {
  const openapi = createOpenApiSpec({
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
