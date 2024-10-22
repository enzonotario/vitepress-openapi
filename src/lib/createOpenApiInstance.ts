import type { OpenAPIData } from '../composables/useOpenapi'
import { parseSpec } from './parseSpec'
import { transformSpec } from './transformSpec'
import { OpenApi } from './OpenApi'

export function createOpenApiInstance({
  spec,
}: {
  spec: OpenAPIData
}): OpenApi {
  const transformedSpec = transformSpec(spec)
  const parsedSpec = parseSpec(transformedSpec)
  return OpenApi({ spec, transformedSpec, parsedSpec })
}
