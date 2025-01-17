import type { OpenAPI } from '@scalar/openapi-types'
import { processOpenAPI } from './processOpenAPI'
import { prepareOpenAPI } from './prepareOpenAPI/prepareOpenAPI'
import { OpenApi } from './OpenApi'

export function createOpenApiInstance({
  spec,
  defaultTag = undefined,
  defaultTagDescription = undefined,
}: {
  spec: OpenAPI.Document
  defaultTag?: string
  defaultTagDescription?: string
}) {
  const transformedSpec = prepareOpenAPI({ spec, defaultTag, defaultTagDescription })
  const parsedSpec = processOpenAPI(transformedSpec)
  return OpenApi({ spec, transformedSpec, parsedSpec })
}
