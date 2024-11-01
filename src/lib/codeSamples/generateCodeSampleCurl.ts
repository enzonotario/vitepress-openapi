import fetchToCurl from '../fetchToCurl'
import { formatJson } from '../formatJson'
import type { OARequest } from './request'

export function generateCodeSampleCurl(request: OARequest) {
  return fetchToCurl({
    method: request.method.toUpperCase(),
    url: request.url,
    headers: {
      ...request.headers,
      ...(!request.headers?.['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
    },
    body: request.body ? formatJson(request.body) : null,
    query: request.query,
  })
}
