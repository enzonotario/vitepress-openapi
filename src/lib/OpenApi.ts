import type { OpenAPIDocument, ParsedOpenAPI } from '../types'
import type { OpenApiSpecInstance } from './OpenApiSpec'
import { createOpenApiSpec } from './OpenApiSpec'

export function OpenApi(options: {
  spec?: ParsedOpenAPI | OpenAPIDocument | null
  originalSpec?: OpenAPIDocument | null
} = {}): OpenApiSpecInstance {
  return createOpenApiSpec({
    spec: options.spec ?? null,
    originalSpec: options.originalSpec ?? null,
  })
}
