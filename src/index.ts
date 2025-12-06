import { OpenAPIV3 } from '@scalar/openapi-types'

export {
  createOpenapi,
  createOpenapiAsync,
  getGlobalOpenapi,
  injectOpenapi,
  provideOpenapi,
  setGlobalOpenapi,
  useOpenapi,
} from './composables/useOpenapi'
export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { OpenApi } from './lib/OpenApi'
export { createOpenApiSpec, type OpenApiSpecInstance } from './lib/OpenApiSpec'
export { parseSpec } from './lib/utils/parseSpec'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']
