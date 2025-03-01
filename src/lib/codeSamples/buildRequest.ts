import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { PlaygroundSecurityScheme } from '../../types'
import { unref } from 'vue'
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

  getAuthorizationsHeaders(authorizations).forEach((value, key) => {
    resolvedHeaders.set(key.toLowerCase(), value)
  })

  return Object.fromEntries(resolvedHeaders)
}

function getAuthorizationsHeaders(authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[]) {
  const headers = new Headers()

  if (authorizations && !Array.isArray(authorizations)) {
    authorizations = [authorizations]
  }

  if (!authorizations?.length) {
    return headers
  }

  Object.entries(authorizations).forEach(([_, authorization]) => {
    if (!authorization?.type) {
      return
    }

    const value = unref(authorization.value ?? authorization.name ?? '')

    if (authorization.type === 'http') {
      headers.set('Authorization', `${authorization.scheme === 'basic' ? 'Basic' : 'Bearer'} ${value}`)
    } else if (authorization.type === 'apiKey') {
      headers.set(authorization.name ?? '', value)
    } else if (authorization.type === 'openIdConnect') {
      headers.set('Authorization', `Bearer ${value}`)
    } else if (authorization.type === 'oauth2') {
      headers.set('Authorization', `Bearer ${value}`)
    } else {
      console.warn('Unknown auth scheme:', authorization)
    }
  })

  return headers
}

function getQuery(
  variables: Record<string, string>,
  queryParameters: OpenAPIV3.ParameterObject[],
) {
  const query: Record<string, string> = {}

  processParameters(variables, queryParameters, (key: string, value: string) => {
    query[key] = value
  })

  return query
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
}: Partial<OARequest>): OARequest {
  const resolvedVariables = setExamplesAsVariables(parameters, variables)

  const pathParameters = parameters.filter(parameter => parameter.in === 'path')
  const queryParameters = parameters.filter(parameter => parameter.in === 'query')
  const headerParameters = parameters.filter(parameter => parameter.in === 'header')

  if (import.meta.env.VITE_DEBUG) {
    console.warn('Building request with parameters:', {
      path,
      method,
      baseUrl,
      pathParameters,
      queryParameters,
      headerParameters,
      authorizations,
      body,
      resolvedVariables,
    })
  }

  const resolvedPath = getPath(resolvedVariables, pathParameters, path)
  const resolveMethod = (method?.toUpperCase() || 'GET') as OpenAPIV3.HttpMethods

  const resolvedQuery = getQuery(resolvedVariables, queryParameters)

  const resolvedHeaders = getHeaders(
    headers,
    resolvedVariables,
    headerParameters,
    authorizations,
  )

  if (baseUrl) {
    baseUrl = resolveBaseUrl(baseUrl)
  }

  const urlInstance = url ? new URL(url) : new URL(`${baseUrl}${resolvedPath}`)

  if (body && !resolvedHeaders['content-type']) {
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
  })
}
