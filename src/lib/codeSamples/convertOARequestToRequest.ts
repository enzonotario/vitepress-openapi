import type { OARequest } from './request'

export function OARequestToRequest(oaRequest: OARequest): Request {
  const url = new URL(oaRequest.url)
  const method = oaRequest.method
  const query = new URLSearchParams(oaRequest.query).toString()

  const headers = new Headers(oaRequest.headers)
  const body = ['POST', 'PUT', 'PATCH'].includes(method) && oaRequest.body ? JSON.stringify(oaRequest.body) : undefined

  if (body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  return new Request(url.toString() + (query ? `?${query}` : ''), {
    method,
    headers,
    body,
  })
}
