import type { OpenAPIDocument } from '../types'
import { prepareOpenAPI } from './prepareOpenAPI/prepareOpenAPI'
import { processOpenAPI } from './processOpenAPI/processOpenAPI'

export function processSpec({
  spec,
  defaultTag = undefined,
  defaultTagDescription = undefined,
}: {
  spec: OpenAPIDocument
  defaultTag?: string
  defaultTagDescription?: string
}) {
  return processOpenAPI(
    prepareOpenAPI({
      spec,
      defaultTag,
      defaultTagDescription,
    }),
  )
}
