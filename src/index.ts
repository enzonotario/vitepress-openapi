import type { OpenAPIV3 } from '@scalar/openapi-types'
import { createOpenApiSpec } from './lib/spec/createOpenApiSpec'

export {
  getGlobalOpenapi,
  injectOpenapi,
  useOpenapi,
} from './composables/useOpenapi'
export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { createOpenApiSpec, type OpenApiSpecInstance } from './lib/spec/createOpenApiSpec'
export { minifyHtml } from './lib/utils/minifyHtml'
export { parseSpec } from './lib/utils/parseSpec'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']

/**
 * @deprecated Use `createOpenApiSpec` instead.
 */
export const OpenApi: typeof createOpenApiSpec = createOpenApiSpec
