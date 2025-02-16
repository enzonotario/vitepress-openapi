import { useOpenapi } from '../composables/useOpenapi'
import { createOpenApiInstance } from './createOpenApiInstance'

export function getOpenApiInstance({
  custom,
  injected,
}: {
  custom?: { spec: any, parsedSpec?: any }
  injected?: any
} = {}) {
  if (custom?.spec) {
    return createOpenApiInstance({ spec: custom.spec })
  }

  if (injected) {
    return injected
  }

  const globalSpec = useOpenapi()
  if (globalSpec?.json) {
    return globalSpec
  }

  console.error('No OpenAPI specification found.')

  return null
}
