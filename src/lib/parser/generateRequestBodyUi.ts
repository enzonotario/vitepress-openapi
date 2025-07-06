import type { ParsedContent, ParsedOpenAPI, ParsedOperation } from '../../types'
import { getSchemaExample } from '../examples/getSchemaExample'
import { getSchemaUi } from './getSchemaUi'
import { httpVerbs } from '../../index'

export function generateRequestBodyUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (!spec.paths) {
    return spec
  }

  for (const path of Object.values(spec.paths)) {
    for (const verb of httpVerbs) {
      const operation = (path as Record<string, any>)[verb] as ParsedOperation

      if (!operation) {
        continue
      }
      if (!operation.requestBody) {
        continue
      }

      for (const [contentType, content] of Object.entries(operation.requestBody.content || {})) {
        const parsedContent = content as ParsedContent

        if (!parsedContent.schema) {
          continue
        }

        parsedContent.ui = getSchemaUi(parsedContent.schema)
        parsedContent.examples = {
          ...(parsedContent.examples || {}),
          ...getSchemaExample(contentType, parsedContent.ui, true),
        }
      }
    }
  }

  return spec
}
