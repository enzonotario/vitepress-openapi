import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'
import { createOpenApiInstance } from './lib/createOpenApiInstance'

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

export function vitepressOpenAPI({
  id,
  spec,
  specs,
}: {
  id?: string
  spec?: OpenAPI
  specs?: Array<Pick<OpenAPIData, 'id' | 'spec'>>
} = {}): Schemas {
  if (!specs) {
    specs = []
  }

  if (spec) {
    specs.push({ id: id || DEFAULT_SCHEMA, spec })
  }

  for (const data of specs) {
    const openapi = createOpenApiInstance({ spec: data.spec })
    schemas.set(data.id, {
      id: data.id,
      spec: data.spec,
      openapi,
      config: {},
    })
  }

  return schemas
}
