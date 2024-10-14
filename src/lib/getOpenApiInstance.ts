import { useOpenapi } from '../composables/useOpenapi'
import { OpenApi } from './OpenApi'

export function getOpenApiInstance({
  custom,
  injected,
} = {}) {
  if (custom?.spec) {
    return OpenApi({ spec: custom?.spec, parsedSpec: custom?.parsedSpec })
  }

  if (injected !== undefined) {
    return injected
  }

  const globalSpec = useOpenapi()
  if (globalSpec) {
    return globalSpec
  }

  console.error('No OpenAPI specification found.')

  return null
}
