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

export function buildRequest({
  path,
  method,
  baseUrl,
  parameters,
  authScheme,
  body,
  variables,
}) {
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
      variables,
    })
  }

  const resolvedPath = getPath(variables, pathParameters, path)

  const query = getQuery(variables, queryParameters)

  const headers = getHeaders(variables, headerParameters, authScheme)

  return new OARequest(
    `${baseUrl}${resolvedPath}`,
    method,
    Object.fromEntries(headers),
    body,
    query,
  )
}
