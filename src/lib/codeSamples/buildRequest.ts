import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { PlaygroundSecurityScheme } from '../../types'
import { unref } from 'vue'
import { DEFAULT_BASE_URL } from '../../composables/useTheme'
import { getPropertyExample } from '../examples/getPropertyExample'
import { resolveBaseUrl } from '../resolveBaseUrl'
import { OARequest } from './request'

type ParameterValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<string | number | boolean | Record<string, unknown>>

function processParameters(
  variables: Record<string, ParameterValue>,
  parameters: OpenAPIV3.ParameterObject[],
  callback: (key: string, value: string) => void,
) {
  const parameterNames = new Set(parameters.map(parameter => parameter.name))
  for (const [key, rawValue] of Object.entries(variables)) {
    if (!parameterNames.has(key)) {
      continue
    }
    if (rawValue === undefined || rawValue === '') {
      continue
    }
    callback(key, String(rawValue))
  }
}

function getPath(variables: Record<string, ParameterValue>, pathParameters: OpenAPIV3.ParameterObject[], path: string = '') {
  let resolvedPath = path
  processParameters(variables, pathParameters, (key, value) => {
    resolvedPath = resolvedPath.replace(`{${key}}`, value)
  })
  return resolvedPath
}

function getHeaders(
  headers: Record<string, string> | Headers | undefined,
  variables: Record<string, ParameterValue>,
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

function serializeDeepObject(key: string, value: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {}
  Object.entries(value).forEach(([k, v]) => {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      const nested = serializeDeepObject(`${key}[${k}]`, v as Record<string, unknown>)
      Object.assign(result, nested)
    } else if (Array.isArray(v)) {
      // Check if array contains only primitives or has objects/arrays
      const hasComplexElements = v.some(el => el !== null && typeof el === 'object')
      if (hasComplexElements) {
        // JSON stringify arrays with objects or nested arrays
        result[`${key}[${k}]`] = JSON.stringify(v)
      } else {
        // Use comma-separated for arrays of primitives
        result[`${key}[${k}]`] = v.join(',')
      }
    } else if (v !== null && typeof v === 'object') {
      // JSON stringify non-plain objects
      result[`${key}[${k}]`] = JSON.stringify(v)
    } else {
      result[`${key}[${k}]`] = String(v)
    }
  })
  return result
}

function serializeParameter(
  key: string,
  value: ParameterValue,
  style: OpenAPIV3.ParameterObject['style'] = 'form',
  explode = true,
): Record<string, string | string[]> {
  if (value === undefined || value === null || value === '') {
    return {}
  }

  if (Array.isArray(value)) {
    // Helper to serialize array elements
    const serializeElement = (element: unknown): string => {
      if (Array.isArray(element) || (element !== null && typeof element === 'object')) {
        return JSON.stringify(element)
      }
      return String(element)
    }

    const serializedValues = value.map(serializeElement)

    if (style === 'spaceDelimited') {
      if (!explode) {
        return { [key]: serializedValues.join(' ') }
      }
      // Return as array for repeated parameters
      return { [key]: serializedValues }
    } else if (style === 'pipeDelimited') {
      if (!explode) {
        return { [key]: serializedValues.join('|') }
      }
      // Return as array for repeated parameters
      return { [key]: serializedValues }
    } else if (style === 'form') {
      if (explode) {
        // Return as array for repeated parameters
        return { [key]: serializedValues }
      }
      // Return comma-separated
      return { [key]: serializedValues.join(',') }
    }
    // Default: explode behavior
    return { [key]: explode ? serializedValues : serializedValues.join(',') }
  }

  if (typeof value === 'object') {
    if (style === 'deepObject') {
      if (explode) {
        return serializeDeepObject(key, value as Record<string, unknown>)
      } else {
        const serialized = Object.entries(value).map(([k, v]) => `${k},${v}`).join(',')
        return { [key]: serialized }
      }
    }

    if (style === 'form') {
      if (explode) {
        return Object.entries(value).reduce((acc, [k, v]) => {
          if (Array.isArray(v)) {
            const hasComplexElements = v.some(el => el !== null && typeof el === 'object')
            acc[k] = hasComplexElements ? JSON.stringify(v) : v.join(',')
          } else if (v !== null && typeof v === 'object') {
            acc[k] = JSON.stringify(v)
          } else {
            acc[k] = String(v)
          }
          return acc
        }, {} as Record<string, string>)
      } else {
        const serialized = Object.entries(value).map(([k, v]) => {
          let serializedValue: string
          if (Array.isArray(v)) {
            const hasComplexElements = v.some(el => el !== null && typeof el === 'object')
            serializedValue = hasComplexElements ? JSON.stringify(v) : v.join(',')
          } else if (v !== null && typeof v === 'object') {
            serializedValue = JSON.stringify(v)
          } else {
            serializedValue = String(v)
          }
          return `${k},${serializedValue}`
        }).join(',')
        return { [key]: serialized }
      }
    }
    return { [key]: JSON.stringify(value) }
  }

  return { [key]: String(value) }
}

function getQuery(
  variables: Record<string, ParameterValue>,
  queryParameters: OpenAPIV3.ParameterObject[],
): Record<string, string | string[]> {
  let query: Record<string, string | string[]> = {}

  queryParameters.forEach((parameter) => {
    if (!parameter.name) {
      return
    }

    const value = variables[parameter.name]
    if (value === undefined || value === '') {
      return
    }

    // Default style for query is form, explode is true
    const style = parameter.style || 'form'
    const explode = parameter.explode ?? true

    const serialized = serializeParameter(parameter.name, value, style, explode)
    query = { ...query, ...serialized }
  })

  return query
}

function getCookies(
  variables: Record<string, ParameterValue>,
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

function setExamplesAsVariables(parameters: OpenAPIV3.ParameterObject[], variables: Record<string, string>): Record<string, string> {
  parameters.forEach((parameter) => {
    if (!parameter.name) {
      return
    }

    if (variables[parameter.name] !== undefined) {
      return
    }

    const example = getPropertyExample(parameter)
    if (example != null) {
      if (typeof example === 'object' && example !== null) {
        variables[parameter.name] = JSON.stringify(example)
      } else {
        variables[parameter.name] = String(example)
      }
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
