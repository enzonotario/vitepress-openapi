import type { OpenAPIDocument } from '../types'
import { OpenApi } from './OpenApi'
import { processOpenAPIAsync } from './processOpenAPI/processOpenAPIAsync'
import { processSpec } from './processSpec'

export function openapiInstance() {
  function sync({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }) {
    return OpenApi({
      spec: processSpec({
        spec,
        defaultTag,
        defaultTagDescription,
      }),
    })
  }

  async function async({
    spec,
    defaultTag = undefined,
    defaultTagDescription = undefined,
  }: {
    spec: OpenAPIDocument
    defaultTag?: string
    defaultTagDescription?: string
  }) {
    return OpenApi({
      spec: await processOpenAPIAsync(
        processSpec({
          spec,
          defaultTag,
          defaultTagDescription,
        }),
      ),
    })
  }

  return {
    sync,
    async,
  }
}
