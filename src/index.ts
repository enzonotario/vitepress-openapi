import { OpenAPIV3 } from '@scalar/openapi-types'
import { createOpenApiSpec } from './lib/spec/createOpenApiSpec'

export {
  getGlobalOpenapi,
  injectOpenapi,
  useOpenapi,
} from './composables/useOpenapi'
export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { createOpenApiSpec, type OpenApiSpecInstance } from './lib/spec/createOpenApiSpec'
export { parseSpec } from './lib/utils/parseSpec'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']

/**
 * @deprecated Use `createOpenApiSpec` instead.
 */
export const OpenApi: typeof createOpenApiSpec = createOpenApiSpec
