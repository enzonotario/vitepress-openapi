import type { Schemas } from '../composables/useOpenapi'
import { DEFAULT_SCHEMA, useOpenapi } from '../composables/useOpenapi'
import { createOpenApiInstance } from './createOpenApiInstance'

export function getOpenApiInstance({
  id,
  custom,
  injected,
}: {
  id?: string
  custom?: { spec: any, parsedSpec?: any }
  injected?: Schemas | any
} = {}) {
  if (id === undefined) {
    id = DEFAULT_SCHEMA
  }

  if (custom?.spec) {
    return createOpenApiInstance({ spec: custom.spec })
  }

  if (injected && injected.schemas) {
    try {
      return injected.schemas.get(id)
    } catch {
      console.warn('Deprecated usage of injected.')
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
