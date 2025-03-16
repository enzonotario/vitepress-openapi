import type { OpenAPIDocument } from '../types'
import { OpenApi } from './OpenApi'
import { prepareOpenAPI } from './prepareOpenAPI/prepareOpenAPI'
import { processOpenAPI } from './processOpenAPI/processOpenAPI'

export function createOpenApiInstance({
  spec,
  parsedSpec,
  defaultTag = undefined,
  defaultTagDescription = undefined,
}: {
  spec: OpenAPIDocument
  parsedSpec?: any
  defaultTag?: string
  defaultTagDescription?: string
}) {
  const transformedSpec = prepareOpenAPI({ spec, defaultTag, defaultTagDescription })

  return OpenApi({
    spec,
    transformedSpec,
    parsedSpec: parsedSpec ?? processOpenAPI(transformedSpec),
  })
}
