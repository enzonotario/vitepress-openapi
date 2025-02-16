import { createAsyncOpenApiInstance } from './createAsyncOpenApiInstance'
import { getOpenApiInstance } from './getOpenApiInstance'

export async function getAsyncOpenApiInstance({
  custom,
  injected,
}: {
  custom?: { spec: any, parsedSpec?: any }
  injected?: any
} = {}) {
  const openapi = getOpenApiInstance({ custom, injected })

  if (!openapi) {
    return null
  }

  return createAsyncOpenApiInstance(openapi)
}
