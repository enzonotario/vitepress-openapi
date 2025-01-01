import type { OpenAPI, OpenAPIV3 } from '@scalar/openapi-types'

export function generateMissingOperationIds(spec: OpenAPI.Document): OpenAPI.Document {
  spec.paths = spec.paths || {}

  for (const path of Object.keys(spec.paths)) {
    const pathValue = spec.paths[path] as Record<string, OpenAPIV3.OperationObject>

    for (const verb of Object.keys(pathValue) as OpenAPIV3.HttpMethods[]) {
      const operation = pathValue[verb]

      if (!operation.operationId) {
        operation.operationId = `${verb}${path.replace(/\//g, '-')}`
      }
    }
  }

  return spec
}
