import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { PlaygroundSecurityScheme } from '../../types'
import { unref } from 'vue'
import { getPropertyExample } from '../examples/getPropertyExample'
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

function getPath(variables: Record<string, string>, pathParameters: OpenAPIV3.ParameterObject[], path: string) {
  let resolvedPath = path
  processParameters(variables, pathParameters, (key, value) => {
    resolvedPath = resolvedPath.replace(`{${key}}`, value)
  })
  return resolvedPath
}

function getHeaders(
  headers: Headers,
  variables: Record<string, string>,
  headerParameters: OpenAPIV3.ParameterObject[],
  authorizations: PlaygroundSecurityScheme | PlaygroundSecurityScheme[],
) {
  const resolvedHeaders = new Headers(headers)

  processParameters(variables, headerParameters, (key: string, value: string) => {
    resolvedHeaders.set(key, value)
  })

  getAuthorizationsHeaders(authorizations).forEach((value, key) => {
    resolvedHeaders.set(key, value)
  })

  return resolvedHeaders
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

function getQuery(variables: Record<string, string>, queryParameters: OpenAPIV3.ParameterObject[]) {
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
  path,
  method,
  baseUrl,
  parameters,
  authorizations = [],
  body,
  headers = {},
  variables = {},
}: {
  path: string
  method: OpenAPIV3.HttpMethods
  baseUrl: string
  parameters: OpenAPIV3.ParameterObject[]
  authorizations?: PlaygroundSecurityScheme | PlaygroundSecurityScheme[]
  body: any
  variables: any
  headers?: Record<string, string>
}) {
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

  const query = getQuery(resolvedVariables, queryParameters)

  const resolvedHeaders = getHeaders(
    new Headers(headers),
    resolvedVariables,
    headerParameters,
    authorizations,
  )

  return new OARequest(
    `${baseUrl}${resolvedPath}`,
    method,
    Object.fromEntries(resolvedHeaders),
    body,
    query,
  )
}
