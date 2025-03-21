import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { ParsedOpenAPI, ParsedOperation } from '../../types'
import { getSecurityUi } from './getSecurityUi'

export function generateSecurityUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (!spec?.paths) {
    return spec
  }

  for (const path of Object.values(spec.paths)) {
    for (const verb of Object.keys(path) as OpenAPIV3.HttpMethods[]) {
      const operation = path[verb] as ParsedOperation

      if (!operation) {
        continue
      }

      operation.securityUi = getSecurityUi(operation.security ?? spec.security ?? [], spec.components?.securitySchemes || {})
    }
  }

  return spec
}
