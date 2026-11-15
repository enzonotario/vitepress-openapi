import type { OpenAPIV3 } from '@scalar/openapi-types'

export const httpVerbs: readonly OpenAPIV3.HttpMethods[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const

export const literalTypes = ['string', 'number', 'integer', 'boolean', 'null']
