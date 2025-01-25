import type { OARequest } from './request'

export function generateCodeSampleJavaScript(request: OARequest) {
  const queryString = Object.keys(request.query ?? {}).length
    ? `?${new URLSearchParams(request.query).toString()}`
    : ''

  const jsFetchOptions = Object.fromEntries(
    Object.entries({
      method: request.method !== 'GET' ? request.method : undefined,
      headers: Object.keys(request.headers ?? {}).length ? 'REPLACE_HEADERS' : undefined,
      body: request.body ? 'REPLACE_BODY' : undefined,
    })
      .filter(([_, v]) => v !== undefined), // Filter undefined values.
  )

  const optionsString = JSON.stringify(jsFetchOptions)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys.
    .replace(/"/g, '\'') // Replace double quotes with single quotes.
    .replace(/REPLACE_BODY/, JSON.stringify(request.body))
    .replace(
      /'REPLACE_HEADERS'/,
      JSON.stringify(request.headers ?? {})
        .replace(/"/g, '\''),
    )

  return `fetch('${request.url}${queryString}'${Object.keys(jsFetchOptions).length ? `, ${optionsString}` : ''})
  .then(response => response.json())
  .then(data => console.log(data));`
}
