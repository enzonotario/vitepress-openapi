import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { ParsedOpenAPI, ParsedOperation } from '../../types'
import { getSecurityUi } from './getSecurityUi'
import { httpVerbs } from '../../index'

export function generateSecurityUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (!spec?.paths) {
    return spec
  }

  for (const path of Object.values(spec.paths)) {
    for (const verb of httpVerbs) {
      const operation = (path as Record<string, any>)[verb] as ParsedOperation

      if (!operation) {
        continue
      }
      operation.securityUi = getSecurityUi(operation.security ?? spec.security ?? [], spec.components?.securitySchemes || {})
    }
  }

  return spec
}
