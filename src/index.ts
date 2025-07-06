import { OpenAPIV3 } from '@scalar/openapi-types'

export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { OpenApi } from './lib/OpenApi'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = [
  OpenAPIV3.HttpMethods.GET,
  OpenAPIV3.HttpMethods.POST,
  OpenAPIV3.HttpMethods.PUT,
  OpenAPIV3.HttpMethods.DELETE,
  OpenAPIV3.HttpMethods.PATCH,
  OpenAPIV3.HttpMethods.OPTIONS,
  OpenAPIV3.HttpMethods.HEAD,
  OpenAPIV3.HttpMethods.TRACE,
]

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']
