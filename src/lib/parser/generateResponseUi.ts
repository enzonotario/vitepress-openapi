import type { ParsedContent, ParsedOpenAPI, ParsedOperation } from '../../types'
import { getSchemaExample } from '../examples/getSchemaExample'
import { getSchemaUi } from './getSchemaUi'

export function generateResponseUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (!spec.paths) {
    return spec
  }

  for (const path of Object.values(spec.paths)) {
    for (const verb of Object.keys(path)) {
      const operation = path[verb] as ParsedOperation

      if (!operation.responses) {
        continue
      }

      for (const response of Object.values(operation.responses || {})) {
        for (const [contentType, content] of Object.entries(response.content || {})) {
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
  }

  return spec
}
