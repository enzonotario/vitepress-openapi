import type { OpenAPI } from '@scalar/openapi-types'
import { processOpenAPI } from './processOpenAPI'
import { prepareOpenAPI } from './prepareOpenAPI'
import { OpenApi } from './OpenApi'

export function createOpenApiInstance({
  spec,
}: {
  spec: OpenAPI.Document
}) {
  const transformedSpec = prepareOpenAPI(spec)
  const parsedSpec = processOpenAPI(transformedSpec)
  return OpenApi({ spec, transformedSpec, parsedSpec })
}
