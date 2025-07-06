import type { ParsedOpenAPI, ParsedOperation } from '../../types'
import { httpVerbs } from '../../index'
import { getSecurityUi } from './getSecurityUi'

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
