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
    const operationsTags = openapi.getOperationsTags()

    const tags = openapi.getTags()
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
    getPathsByVerbs: openapi.getPathsByVerbs,
    getTags,
  }
}
