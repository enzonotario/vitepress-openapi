import { useOpenapi } from '../composables/useOpenapi'
import type { Schemas } from '../vitepress-openapi'
import { DEFAULT_SCHEMA } from '../vitepress-openapi'
import type { OpenApi } from './OpenApi'
import { createOpenApiInstance } from './createOpenApiInstance'

export function getOpenApiInstance({
  id,
  custom,
  injected,
}: {
  id?: string
  custom?: { spec: any, parsedSpec: any }
  injected?: Schemas | any
} = {}): OpenApi | null {
  if (id === undefined) {
    id = DEFAULT_SCHEMA
  }

  if (custom?.spec) {
    return createOpenApiInstance({ spec: custom.spec })
  }

  if (injected !== undefined) {
    try {
      return injected.get(id)?.openapi || null
    } catch {
      console.warn('Deprecated usage of injected. Use `vitepressOpenAPI` instead.')
      return injected
    }
  }

  const globalSpec = useOpenapi()
  if (globalSpec) {
    return globalSpec
  }

  console.error('No OpenAPI specification found.')

  return null
}
