import type { OpenAPI, OpenAPIV3 } from '@scalar/openapi-types'
import { useTheme } from '../../composables/useTheme'

export function generateMissingTags(spec: OpenAPI.Document): OpenAPI.Document {
  const defaultTag = useTheme().getSpecConfig()?.defaultTag || 'Default'

  const operationTags = new Set<string>()

  spec.paths = spec.paths || {}

  for (const path of Object.values(spec.paths)) {
    for (const verb of Object.keys(path) as OpenAPIV3.HttpMethods[]) {
      const operation = path[verb]
      const tags = operation.tags || [defaultTag]
      operation.tags = tags
      tags.forEach((tag: string) => operationTags.add(tag))
    }
  }

  spec.tags = spec.tags || []
  if (
    operationTags.has(defaultTag)
    && !spec.tags.find((tag: any) => tag.name === defaultTag)) {
    spec.tags.push({
      name: defaultTag,
      description: useTheme().getSpecConfig()?.defaultTagDescription,
    })
  }

  return spec
}
