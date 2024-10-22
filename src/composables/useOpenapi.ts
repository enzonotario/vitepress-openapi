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

  function setSpec(value: any) {
    setupOpenApi({ spec: value })
  }

  function setupOpenApi({ spec }) {
    addSchema({ id: DEFAULT_SCHEMA, spec })
    mainSchema = schemas.get(DEFAULT_SCHEMA)
  }

  function addSchema({ id, spec }) {
    const openapi = createOpenApiInstance({ spec })
    schemas.set(id, {
      id,
      spec,
      openapi,
      config: {},
    })
  }

  return {
    ...(mainSchema?.openapi || {}),
    spec: mainSchema?.parsedSpec,
    json: mainSchema?.spec,
    setSpec,
    schemas,
  }
}
