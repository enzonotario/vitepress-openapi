import type { OpenAPI, OpenAPIV3, OpenAPIV3_1 } from '@scalar/openapi-types'
import type { RemovableRef } from '@vueuse/core'

/**
 * Slots required for OAOperation component.
 */
export type OperationSlot =
  | 'header'
  | 'tags'
  | 'path'
  | 'description'
  | 'security'
  | 'parameters'
  | 'request-body'
  | 'responses'
  | 'try-it'
  | 'code-samples'
  | 'branding'
  | 'footer'
  // TODO: Implement these slots.
  // | 'summary'
  // | 'servers'

export type ParsedOpenAPI = OpenAPI.Document & {
  paths: OpenAPIV3.PathsObject & OpenAPIV3_1.PathsObject & {
    [key: string]: OpenAPIV3.PathItemObject & OpenAPIV3_1.PathItemObject & {
      [key: string]: ParsedOperation
    }
  }
}

export type ParsedOperation = OpenAPIV3.OperationObject & OpenAPIV3_1.OperationObject & {
  requestBody: OpenAPIV3.RequestBodyObject & OpenAPIV3_1.RequestBodyObject & {
    content: ParsedContent
  }
  responses: OpenAPIV3.ResponsesObject & OpenAPIV3_1.ResponsesObject & {
    [key: string]: OpenAPIV3.ResponseObject & OpenAPIV3_1.ResponseObject & {
      content: {
        [key: string]: ParsedContent
      }
    }
  }
}

export type ParsedContent = OpenAPIV3.MediaTypeObject & OpenAPIV3_1.MediaTypeObject & {
  schema: OpenAPIV3.SchemaObject & OpenAPIV3_1.SchemaObject
  ui?: any
  uiContentType?: string
}

export type OperationObject = OpenAPIV3.Document | OpenAPIV3_1.OperationObject

export type PlaygroundSecurityScheme = OpenAPIV3.HttpSecurityScheme & OpenAPIV3.ApiKeySecurityScheme & OpenAPIV3.OAuth2SecurityScheme & OpenAPIV3.OpenIdSecurityScheme & {
  playgroundValue: RemovableRef<any>
}
