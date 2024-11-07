import { OARequest } from './request'

function getPath(variables, pathParameters, path) {
  for (const [key, value] of Object.entries(variables)) {
    if (!pathParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (value === undefined || value === '') {
      continue
    }

    path = path.replace(`{${key}}`, value)
  }
  return path
}

function getHeaders(variables, headerParameters, authScheme) {
  const headers = new Headers({})

  for (const [key, value] of Object.entries(variables)) {
    if (!headerParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (value === undefined || value === '') {
      continue
    }

    headers.set(key, value)
  }

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

  for (const [key, value] of Object.entries(variables)) {
    if (!queryParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (value === undefined || value === '') {
      continue
    }

    query[key] = value
  }

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
