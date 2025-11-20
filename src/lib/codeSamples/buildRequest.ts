import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { PlaygroundSecurityScheme } from '../../types'
import { unref } from 'vue'
import { DEFAULT_BASE_URL } from '../../composables/useTheme'
import { getPropertyExample } from '../examples/getPropertyExample'
import { resolveBaseUrl } from '../resolveBaseUrl'
import { OARequest } from './request'
function processParameters(variables: Record<string, string>, parameters: OpenAPIV3.ParameterObject[], callback: (key: string, value: string) => void) {
  const parameterNames = new Set(parameters.map(parameter => parameter.name))
  for (const [key, value] of Object.entries(variables)) {
    if (!parameterNames.has(key)) {
      continue
    }
    if (value === undefined || value === '') {
      continue
    }
    callback(key, value)
  }
}

function getPath(variables: Record<string, string>, pathParameters: OpenAPIV3.ParameterObject[], path: string = '') {
  let resolvedPath = path
  processParameters(variables, pathParameters, (key, value) => {
    resolvedPath = resolvedPath.replace(`{${key}}`, value)
  })
  return resolvedPath
}

function getHeaders(
  headers: Record<string, string> | Headers | undefined,
  variables: Record<string, string>,
  headerParameters: OpenAPIV3.ParameterObject[],
  authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[],
): Record<string, string> {
  const resolvedHeaders = new Headers()

  if (headers) {
    if (headers instanceof Headers) {
      for (const [key, value] of headers.entries()) {
        resolvedHeaders.set(key.toLowerCase(), value)
      }
    } else {
      for (const [key, value] of Object.entries(headers)) {
        resolvedHeaders.set(key.toLowerCase(), value)
      }
    }
  }

  processParameters(variables, headerParameters, (key: string, value: string) => {
    resolvedHeaders.set(key.toLowerCase(), value)
  })

  getAuthorizationsHeaders(authorizations).forEach((value: string, key: string) => {
    resolvedHeaders.set(key.toLowerCase(), value)
  })

  return Object.fromEntries(resolvedHeaders)
}

export function getAuthorizationsHeaders(authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[]) {
  const headers = new Headers()

  if (!authorizations) {
    return headers
  }

  const authArray = Array.isArray(authorizations) ? authorizations : [authorizations]

  if (authArray.length === 0) {
    return headers
  }

  for (const authorization of authArray) {
    if (!authorization?.type) {
      continue
    }

    const value = unref(authorization.value ?? authorization.name ?? '')

    if (!value) {
      console.warn('Empty value for authorization scheme:', authorization.type)
      continue
    }

    switch (authorization.type) {
      case 'http':
        headers.set('Authorization', value)
        break

      case 'apiKey':
        if (!authorization.in || authorization.in === 'header') {
          headers.set(authorization.name ?? '', value)
        }
        break

      case 'openIdConnect':
      case 'oauth2':
        headers.set('Authorization', `Bearer ${value}`)
        break

      default:
        console.warn('Unknown authorization type:', authorization.type)
    }
  }

  return headers
}

function serializeParameter(
  key: string,
  value: any,
  style: string = 'form',
  explode: boolean = true,
): Record<string, string> {
  if (value === undefined || value === null || value === '') {
    return {}
  }

  // deepObject style for nested objects (e.g., metadata[key]=val)
  if (style === 'deepObject' && typeof value === 'object' && !Array.isArray(value)) {
    const result: Record<string, string> = {}
    Object.entries(value).forEach(([k, v]) => {
      result[`${key}[${k}]`] = String(v)
    })
    return result
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (style === 'form') {
      if (explode) {
        // Can't represent duplicate keys in Record<string, string>
        // Join with comma as fallback
        return { [key]: value.join(',') }
      } else {
        // form + no explode: comma-separated
        return { [key]: value.join(',') }
      }
    } else if (style === 'spaceDelimited') {
      return { [key]: value.join(' ') }
    } else if (style === 'pipeDelimited') {
      return { [key]: value.join('|') }
    }
    // Default: comma-separated
    return { [key]: value.join(',') }
  }

  // Handle objects
  if (typeof value === 'object') {
    if (style === 'form') {
      if (explode) {
        // Flatten object: key1=val1&key2=val2
        return Object.entries(value).reduce((acc, [k, v]) => {
          acc[k] = String(v)
          return acc
        }, {} as Record<string, string>)
      } else {
        // key=k1,v1,k2,v2
        const serialized = Object.entries(value).map(([k, v]) => `${k},${v}`).join(',')
        return { [key]: serialized }
      }
    }
    // For other styles with objects, stringify
    return { [key]: JSON.stringify(value) }
  }

  // Primitive values
  return { [key]: String(value) }
}

function getQuery(
  variables: Record<string, string | number | boolean | object | (string | number | boolean | object)[]>,
  queryParameters: OpenAPIV3.ParameterObject[],
) {
  let query: Record<string, string> = {}

  queryParameters.forEach((parameter) => {
    if (!parameter.name) return

    const value = variables[parameter.name]
    if (value === undefined || value === '') return

    // Default style for query is form, explode is true
    const style = parameter.style || 'form'
    const explode = parameter.explode ?? true

    const serialized = serializeParameter(parameter.name, value, style, explode)
    query = { ...query, ...serialized }
  })

  return query
}

function getCookies(
  variables: Record<string, string>,
  cookieParameters: OpenAPIV3.ParameterObject[],
) {
  const cookies: Record<string, string> = {}

  processParameters(variables, cookieParameters, (key: string, value: string) => {
    cookies[key] = value
  })

  return cookies
}

export function getAuthorizationsQuery(authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[]) {
  const params: Record<string, string> = {}

  if (!authorizations) {
    return params
  }

  const authArray = Array.isArray(authorizations) ? authorizations : [authorizations]
  for (const authorization of authArray) {
    if (!authorization?.type) {
      continue
    }

    if (authorization.type === 'apiKey' && authorization.in === 'query') {
      const value = unref(authorization.value ?? authorization.name ?? '')
      if (!value) {
        continue
      }
      const name = authorization.name ?? ''
      if (!name) {
        continue
      }
      params[name] = value
    }
  }

  return params
}

export function getAuthorizationsCookies(authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[]) {
  const cookies: Record<string, string> = {}

  if (!authorizations) {
    return cookies
  }

  const authArray = Array.isArray(authorizations) ? authorizations : [authorizations]
  for (const authorization of authArray) {
    if (!authorization?.type) {
      continue
    }

    if (authorization.type === 'apiKey' && authorization.in === 'cookie') {
      const value = unref(authorization.value ?? authorization.name ?? '')
      if (!value) {
        continue
      }
      const name = authorization.name ?? ''
      if (!name) {
        continue
      }
      cookies[name] = value
    }
  }

  return cookies
}

function setExamplesAsVariables(parameters: OpenAPIV3.ParameterObject[], variables: Record<string, string>) {
  parameters.forEach((parameter) => {
    if (!parameter.name) {
      return
    }

    if (variables[parameter.name] !== undefined) {
      return
    }

    const example = getPropertyExample(parameter)
    if (example != null) {
      variables[parameter.name] = example
    }
  })

  return variables
}

export function buildRequest({
  url = undefined,
  path,
  method = 'GET' as OpenAPIV3.HttpMethods,
  baseUrl,
  parameters = [],
  authorizations = [],
  body = undefined,
  headers = undefined,
  variables = {},
  cookies = {},
  contentType = undefined,
}: Partial<OARequest>): OARequest {
  const resolvedVariables = setExamplesAsVariables(parameters, variables)

  const pathParameters = parameters.filter(parameter => parameter.in === 'path')
  const queryParameters = parameters.filter(parameter => parameter.in === 'query')
  const headerParameters = parameters.filter(parameter => parameter.in === 'header')
  const cookieParameters = parameters.filter(parameter => parameter.in === 'cookie')

  if (import.meta.env.VITE_DEBUG) {
    console.warn('Building request with parameters:', {
      path,
      method,
      baseUrl,
      pathParameters,
      queryParameters,
      headerParameters,
      cookieParameters,
      authorizations,
      body,
      resolvedVariables,
    })
  }

  const resolvedPath = getPath(resolvedVariables, pathParameters, path)
  const resolveMethod = (method?.toUpperCase() || 'GET') as OpenAPIV3.HttpMethods

  const resolvedQuery = {
    ...getQuery(resolvedVariables, queryParameters),
    ...getAuthorizationsQuery(authorizations),
  }

  const resolvedHeaders = getHeaders(
    headers,
    resolvedVariables,
    headerParameters,
    authorizations,
  )

  const resolvedCookies = {
    ...(cookies || {}),
    ...getCookies(resolvedVariables, cookieParameters),
    ...getAuthorizationsCookies(authorizations),
  }

  baseUrl = baseUrl ? resolveBaseUrl(baseUrl) : DEFAULT_BASE_URL

  const urlInstance = url ? new URL(url) : (baseUrl ? new URL(`${baseUrl}${resolvedPath}`) : new URL(resolvedPath, 'http://localhost'))

  if (contentType && !(body instanceof FormData)) {
    resolvedHeaders['content-type'] = contentType
  } else if (body && !resolvedHeaders['content-type'] && !(body instanceof FormData)) {
    resolvedHeaders['content-type'] = 'application/json'
  }

  return new OARequest({
    path: resolvedPath,
    url: urlInstance,
    method: resolveMethod,
    parameters,
    authorizations,
    body: [
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
      'TRACE',
    ].includes(resolveMethod) && body
      ? body
      : undefined,
    variables: resolvedVariables,
    headers: resolvedHeaders,
    query: resolvedQuery,
    cookies: resolvedCookies,
    contentType: resolvedHeaders['content-type'],
  })
}
