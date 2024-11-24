import type { OpenAPIV3 } from '@scalar/openapi-types'
import { unref } from 'vue'
import { getExample } from '../getExample'
import type { PlaygroundSecurityScheme } from '../../types'
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

function getHeaders(variables: Record<string, string>, headerParameters: OpenAPIV3.ParameterObject[], authScheme: PlaygroundSecurityScheme | null) {
  const headers = new Headers({})

  processParameters(variables, headerParameters, (key: string, value: string) => {
    headers.set(key, value)
  })

  if (!authScheme) {
    return headers
  }

  const value = unref(authScheme.playgroundValue)

  if (authScheme.type === 'http') {
    headers.set('Authorization', `${authScheme.scheme === 'basic' ? 'Basic' : 'Bearer'} ${value}`)
  } else if (authScheme.type === 'apiKey') {
    headers.set(authScheme.name ?? '', value)
  } else if (authScheme.type === 'openIdConnect') {
    headers.set('Authorization', `Bearer ${value}`)
  } else if (authScheme.type === 'oauth2') {
    headers.set('Authorization', `Bearer ${value}`)
  } else {
    console.warn('Unknown auth scheme:', authScheme)
  }

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

    const example = getExample(parameter)
    if (example !== null) {
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
  authScheme,
  body,
  variables = {},
}: {
  path: string
  method: OpenAPIV3.HttpMethods
  baseUrl: string
  parameters: OpenAPIV3.ParameterObject[]
  authScheme: PlaygroundSecurityScheme | null
  body: any
  variables: any
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
      authScheme,
      body,
      resolvedVariables,
    })
  }

  const resolvedPath = getPath(resolvedVariables, pathParameters, path)

  const query = getQuery(resolvedVariables, queryParameters)

  const headers = getHeaders(resolvedVariables, headerParameters, authScheme)

  return new OARequest(
    `${baseUrl}${resolvedPath}`,
    method,
    Object.fromEntries(headers),
    body,
    query,
  )
}
