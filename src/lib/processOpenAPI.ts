import { merge } from 'allof-merge'
import type { JSONSchema } from '@trojs/openapi-dereference'
import { dereferenceSync } from '@trojs/openapi-dereference'
import type { OpenAPI, OpenAPIV3 } from '@scalar/openapi-types'
import type { ParsedContent, ParsedOpenAPI, ParsedOperation } from '../types.js'
import { getSchemaUi } from './getSchemaUi'
import { getSchemaUiContentType } from './getSchemaUiContentType'
import { getSecurityUi } from './getSecurityUi'

function safelyMergeSpec(spec: OpenAPI.Document): ParsedOpenAPI {
  try {
    return merge(spec) as ParsedOpenAPI
  } catch (error: any) {
    console.warn('Failed to merge OpenAPI spec:', error.message)
    return spec as ParsedOpenAPI
  }
}

function safelyDereferenceSpec(spec: OpenAPI.Document): ParsedOpenAPI {
  try {
    return dereferenceSync(spec as JSONSchema) as ParsedOpenAPI
  } catch (error: any) {
    console.warn('Failed to dereference OpenAPI spec:', error.message)
    return spec as ParsedOpenAPI
  }
}

function safelyGenerateSchemaUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  try {
    return generateSchemaUi(spec)
  } catch (error: any) {
    console.warn('Failed to generate schema UI:', error.message)
    return spec
  }
}

export function processOpenAPI(spec: OpenAPI.Document): ParsedOpenAPI {
  if (import.meta.env.VITE_DEBUG) {
    console.debug('Processing OpenAPI spec:', spec)
  }

  let parsedSpec = safelyMergeSpec(spec)
  parsedSpec = safelyDereferenceSpec(parsedSpec)
  parsedSpec = safelyGenerateSecurityUi(parsedSpec)
  parsedSpec = safelyGenerateSchemaUi(parsedSpec)

  return { ...parsedSpec }
}

function safelyGenerateSecurityUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (!spec?.paths) {
    return spec
  }

  for (const path of Object.values(spec.paths)) {
    for (const verb of Object.keys(path) as OpenAPIV3.HttpMethods[]) {
      const operation = path[verb] as ParsedOperation

      if (!operation) {
        continue
      }

      operation.securityUi = getSecurityUi(operation.security ?? spec.security, spec.components?.securitySchemes || {})
    }
  }

  return spec
}

function generateSchemaUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (!spec?.paths) {
    return spec
  }

  for (const path of Object.values(spec.paths)) {
    for (const verb of Object.keys(path) as OpenAPIV3.HttpMethods[]) {
      const operation = path[verb] as ParsedOperation

      if (!operation) {
        continue
      }

      enhanceRequestBody(operation)
      enhanceResponses(operation)
    }
  }

  return spec
}

function enhanceRequestBody(operation: ParsedOperation): void {
  if (!operation.requestBody) {
    return
  }

  for (const [contentType, content] of Object.entries(operation.requestBody.content || {})) {
    const parsedContent = content as ParsedContent

    if (!parsedContent.schema) {
      continue
    }

    parsedContent.ui = getSchemaUi(parsedContent.schema)
    parsedContent.uiContentType = getSchemaUiContentType(contentType, parsedContent.ui, true)
  }
}

function enhanceResponses(operation: ParsedOperation): void {
  if (!operation.responses) {
    return
  }

  for (const response of Object.values(operation.responses || {})) {
    for (const [contentType, content] of Object.entries(response.content || {})) {
      const parsedContent = content as ParsedContent

      if (!parsedContent.schema) {
        continue
      }

      parsedContent.ui = getSchemaUi(parsedContent.schema)
      parsedContent.uiContentType = getSchemaUiContentType(contentType, parsedContent.ui, true)
    }
  }
}
