import type { OARequest } from './request'

export function generateCodeSamplePython(request: OARequest): string {
  const { url, method, headers, body, query } = request

  let queryString
  if (Object.keys(query ?? {}).length) {
    queryString = `params = ${JSON.stringify(query, null, 4).replace(/"([^"]+)":/g, '\'$1\':').replace(/"/g, '\'')}`
  }

  let headersString
  if (Object.keys(headers ?? {}).length) {
    headersString = `headers = ${JSON.stringify(headers, null, 4).replace(/"([^"]+)":/g, '\'$1\':').replace(/"/g, '\'')}`
  }

  let bodyString
  if (body) {
    bodyString = `data = ${JSON.stringify(body, null, 4).replace(/"([^"]+)":/g, '\'$1\':').replace(/"/g, '\'')}`
  }

  return (`import requests

url = '${url}'
${queryString || ''}
${headersString || ''}
${bodyString || ''}

response = requests.${method.toLowerCase()}(url${queryString ? ', params=params' : ''}${headersString ? ', headers=headers' : ''}${bodyString ? ', json=data' : ''})
print(response.json())
`)
    .replace(/\n{2,}/g, '\n\n') // Remove extra newlines.
}
