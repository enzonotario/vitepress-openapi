import { OpenAPIV3 } from '@scalar/openapi-types'

export { usePaths } from './composables/usePaths'
export { useSidebar } from './composables/useSidebar'
export { OpenApi } from './lib/OpenApi'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']
