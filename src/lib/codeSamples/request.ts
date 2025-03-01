import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { PlaygroundSecurityScheme } from '../../types'
import { DEFAULT_BASE_URL } from '../../composables/useTheme'

export interface IOARequest {
  baseUrl?: string
  path?: string
  url: URL
  method: OpenAPIV3.HttpMethods
  parameters?: OpenAPIV3.ParameterObject[]
  authorizations?: PlaygroundSecurityScheme | PlaygroundSecurityScheme[]
  body?: any
  variables?: Record<string, string>
  headers: Record<string, string>
  query: Record<string, string>
  contentType?: string
  cookies?: Record<string, string>
}

export class OARequest {
  public readonly baseUrl: string | undefined
  public readonly path: string | undefined
  public readonly url: URL
  public readonly method: OpenAPIV3.HttpMethods
  public readonly parameters: OpenAPIV3.ParameterObject[] | undefined
  public readonly authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[] | undefined
  public readonly body: any | undefined
  public readonly variables: Record<string, any>
  public readonly headers: Record<string, string>
  public readonly query: Record<string, string>
  public readonly contentType: string | undefined
  public readonly cookies: Record<string, string>

  constructor({
    baseUrl,
    path,
    url,
    method,
    parameters,
    authorizations,
    body,
    variables,
    headers,
    query,
    contentType,
    cookies,
  }: IOARequest) {
    const urlInstance = url || (baseUrl && path ? new URL(`${baseUrl}${path}`) : new URL(DEFAULT_BASE_URL))

    this.baseUrl = baseUrl
    this.path = path
    this.url = urlInstance
    this.method = method
    this.parameters = parameters
    this.authorizations = authorizations
    this.body = body
    this.variables = variables || {}
    this.headers = headers || {}
    this.query = query || {}
    this.contentType = contentType
    this.cookies = cookies || {}
  }
}
