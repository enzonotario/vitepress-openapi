import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'
import { createOpenApiInstance } from '../lib/createOpenApiInstance'

export type OpenAPI = OpenAPIV3.Document | OpenAPIV3_1.Document

export interface OpenAPIData {
  id: string
  spec: OpenAPI
  openapi: any
  config: any
}

export type Schemas = Map<string, OpenAPIData>

export const DEFAULT_SCHEMA = 'main'

const schemas: Schemas = new Map()

let mainSchema = null

export function useOpenapi({ spec } = { spec: null }) {
  if (spec !== null) {
    setupOpenApi({ spec })
  }

  /**
   * @deprecated Use `useOpenapi({ spec })` instead.
   */
  function setSpec(value: any) {
    console.warn('Deprecated usage of `setSpec`. Use `useOpenapi({ spec })` instead.')
    setupOpenApi({ spec: value })
  }

  function setupOpenApi({ spec }) {
    addSchema({ id: DEFAULT_SCHEMA, spec })
    mainSchema = schemas.get(DEFAULT_SCHEMA)
  }

  function addSchema({ id, spec }) {
    const openapi = createOpenApiInstance({ spec })
    schemas.set(id, {
      ...openapi,
      id,
      config: {},
    })
  }

  return {
    ...mainSchema,
    json: mainSchema?.spec,
    setSpec,
    schemas,
  }
}
