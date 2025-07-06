import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OpenAPIDocument } from '../../types'
import { httpVerbs } from '../../index'

export function generateMissingOperationIds(spec: OpenAPIDocument): OpenAPIDocument {
  spec.paths = spec.paths || {}

  for (const path of Object.keys(spec.paths)) {
    const pathValue = spec.paths[path] as Record<string, OpenAPIV3.OperationObject>

    for (const verb of httpVerbs) {
      const operation = pathValue[verb]

      if (!operation) {
        continue
      }

      if (!operation.operationId) {
        operation.operationId = `${verb}${path.replace(/\//g, '-')}`
      }
    }
  }

  return spec
}
