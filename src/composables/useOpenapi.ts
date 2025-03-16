import type { OpenApi } from '../lib/OpenApi'
import type { OpenAPIDocument } from '../types'
import type { PartialUseThemeConfig } from './useTheme'
import { createOpenApiInstance } from '../lib/createOpenApiInstance'
import { useTheme } from './useTheme'

export const OPENAPI_LOCAL_KEY = Symbol('openapiLocal')

let openapi: ReturnType<typeof OpenApi> | null = null

export function useOpenapi({
  spec,
  parsedSpec,
  config,
}: {
  spec?: OpenAPIDocument
  parsedSpec?: any
  config?: PartialUseThemeConfig
} = {}) {
  if (config) {
    useTheme(config)
  }

  if (spec) {
    setupOpenApi({ spec, config })
  }

  function setupOpenApi({
    spec,
  }: {
    spec: OpenAPIDocument
    parsedSpec?: any
    config?: PartialUseThemeConfig
  }) {
    openapi = createOpenApiInstance({
      spec,
      parsedSpec,
    })
  }

  return openapi
}
