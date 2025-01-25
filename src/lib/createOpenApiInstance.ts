import type { OpenAPI } from '@scalar/openapi-types'
import { OpenApi } from './OpenApi'
import { prepareOpenAPI } from './prepareOpenAPI/prepareOpenAPI'
import { processOpenAPI } from './processOpenAPI'

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
