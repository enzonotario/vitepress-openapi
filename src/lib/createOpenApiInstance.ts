import type { OpenAPIDocument } from '../types'
import { OpenApi } from './OpenApi'

export function createOpenApiInstance({
  spec,
  parsedSpec,
}: {
  spec: OpenAPIDocument
  parsedSpec?: any
  defaultTag?: string
  defaultTagDescription?: string
}) {
  return OpenApi({
    spec,
    transformedSpec: parsedSpec,
    parsedSpec,
  })
}
