import fetchToCurl from '../fetchToCurl'
import type { OARequest } from './request'

export function generateCodeSampleCurl(request: OARequest) {
  return fetchToCurl({
    method: request.method.toUpperCase(),
    url: request.url,
    headers: request.headers,
    body: request.body ? JSON.stringify(request.body, null, 2) : undefined,
    query: request.query,
  })
}
