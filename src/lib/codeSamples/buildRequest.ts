import { getExample } from '../getExample'
import { OARequest } from './request'

function processParameters(variables, parameters, callback) {
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

function getPath(variables, pathParameters, path) {
  let resolvedPath = path
  processParameters(variables, pathParameters, (key, value) => {
    resolvedPath = resolvedPath.replace(`{${key}}`, value)
  })
  return resolvedPath
}

function getHeaders(variables, headerParameters, authScheme) {
  const headers = new Headers({})

  processParameters(variables, headerParameters, (key, value) => {
    headers.set(key, value)
  })

  if (authScheme) {
    switch (authScheme.type) {
      case 'http':
        headers.set('Authorization', `${authScheme.scheme === 'basic' ? 'Basic' : 'Bearer'} ${authScheme.value}`)
        break
      case 'apiKey':
        headers.set(authScheme.name, authScheme.value)
        break
      case 'openIdConnect':
        headers.set('Authorization', `Bearer ${authScheme.value}`)
        break
      case 'oauth2':
        headers.set('Authorization', `Bearer ${authScheme.value}`)
        break
    }
  }
  return headers
}

function getQuery(variables, queryParameters) {
  const query = {}

  processParameters(variables, queryParameters, (key, value) => {
    query[key] = value
  })

  return query
}

function setExamplesAsVariables(parameters, variables) {
  parameters.forEach((parameter) => {
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
