import type { OpenAPIV3 } from '@scalar/openapi-types'

export function createCompositeKey({
  parameter,
  operationId,
}: {
  parameter: OpenAPIV3.ParameterObject
  operationId: string
}): string {
  if (!parameter.name || !parameter.in) {
    return ''
  }

  return `${operationId}:${parameter.in}:${parameter.name}`
}
