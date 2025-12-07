import { OpenAPIV3 } from '@scalar/openapi-types'

export {
  getGlobalOpenapi,
  injectOpenapi,
  useOpenapi,
} from './composables/useOpenapi'
export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { createOpenApiSpec, type OpenApiSpecInstance } from './lib/OpenApiSpec'
export { parseSpec } from './lib/utils/parseSpec'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']
