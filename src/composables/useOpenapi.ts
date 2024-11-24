import type { OpenAPI } from '@scalar/openapi-types'
import { createOpenApiInstance } from '../lib/createOpenApiInstance'
import type { UseThemeConfigUnref } from './useTheme'
import { useTheme } from './useTheme'

export interface OpenAPIData {
  id: string
  spec: OpenAPI.Document
  openapi: any
  config: any
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
  config?: UseThemeConfigUnref
} = {}) {
  if (config) {
    useTheme(config)
  }

  if (spec !== null && spec !== undefined) {
    setupOpenApi({ spec, config })
  }

  /**
   * @deprecated Use `useOpenapi({ spec })` instead.
   */
  function setSpec(value: OpenAPI.Document) {
    console.warn('Deprecated usage of `setSpec`. Use `useOpenapi({ spec })` instead.')
    setupOpenApi({ spec: value })
  }

  function setupOpenApi({ spec, config }: { spec: OpenAPI.Document, config?: UseThemeConfigUnref }) {
    addSchema({ id: DEFAULT_SCHEMA, spec, config })
    mainSchema = schemas.get(DEFAULT_SCHEMA) as OpenAPI.Document
  }

  function addSchema({ id, spec, config }: { id: string, spec: OpenAPI.Document, config?: UseThemeConfigUnref | null }) {
    const openapi = createOpenApiInstance({ spec })

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
