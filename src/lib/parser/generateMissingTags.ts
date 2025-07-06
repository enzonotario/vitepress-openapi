import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OpenAPIDocument } from '../../types'
import { httpVerbs } from '../../index'

export function generateMissingTags({
  spec,
  defaultTag = 'Default',
  defaultTagDescription = '',
}: {
  spec: OpenAPIDocument
  defaultTag?: string
  defaultTagDescription?: string
}): OpenAPIDocument {
  const operationTags = new Set<string>()

  spec.paths = spec.paths || {}

  for (const [, pathObject] of Object.entries(spec.paths)) {
    for (const verb of httpVerbs) {
      if (!pathObject || !pathObject[verb]) {
        continue
      }

      const operation = pathObject[verb]
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
      description: defaultTagDescription,
    })
  }

  return spec
}
