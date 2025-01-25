import type { OpenAPI } from '@scalar/openapi-types'
import type { PartialUseThemeConfig } from './useTheme'
import { createOpenApiInstance } from '../lib/createOpenApiInstance'
import { useTheme } from './useTheme'

export interface OpenAPIData {
  id: string
  spec: OpenAPI.Document
  openapi: ReturnType<typeof createOpenApiInstance>
  config?: PartialUseThemeConfig
}

export type Schemas = Map<string, OpenAPIData>

export const DEFAULT_SCHEMA = 'main'

const schemas: Schemas = new Map()

let mainSchema: OpenAPI.Document | null = null

export function useOpenapi({
  spec,
  config,
}: {
  spec?: OpenAPI.Document
  config?: PartialUseThemeConfig
} = {}) {
  if (config) {
    useTheme(config)
  }

  if (spec) {
    setupOpenApi({ spec, config })
  }

  /**
   * @deprecated Use `useOpenapi({ spec })` instead.
   */
  function setSpec(value: OpenAPI.Document) {
    console.warn('Deprecated usage of `setSpec`. Use `useOpenapi({ spec })` instead.')
    setupOpenApi({ spec: value })
  }

  function setupOpenApi({ spec, config }: { spec: OpenAPI.Document, config?: PartialUseThemeConfig }) {
    addSchema({ id: DEFAULT_SCHEMA, spec, config })
    mainSchema = (schemas.get(DEFAULT_SCHEMA) ?? {}) as OpenAPI.Document
  }

  function addSchema({ id, spec, config }: { id: string, spec: OpenAPI.Document, config?: PartialUseThemeConfig }) {
    const openapi = createOpenApiInstance({
      spec,
      defaultTag: config?.spec?.defaultTag,
      defaultTagDescription: config?.spec?.defaultTagDescription,
    })

    // @ts-expect-error: This adds all the properties of the OpenAPI instance to the schema.
    schemas.set(id, {
      ...openapi,
      id,
      config,
    })
  }

  return {
    ...mainSchema,
    json: mainSchema?.spec,
    setSpec,
    schemas,
  }
}
