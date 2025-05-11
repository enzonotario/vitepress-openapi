import type { HarRequest } from '@scalar/snippetz'
import type { OARequest } from './request'

export function buildHarRequest(
  oaRequest: OARequest,
): HarRequest {
  const harRequest: HarRequest = {
    method: oaRequest.method.toUpperCase(),
    url: decodeURI(oaRequest.url.toString()),
    httpVersion: 'HTTP/1.1',
    headers: Object.entries(oaRequest.headers).map(([name, value]) => ({
      name: name.replace(/\b\w/g, letter => letter.toUpperCase()), // Convert to title case.
      value,
    })),
    queryString: [
      ...Object.entries(oaRequest.query).map(([name, value]) => ({
        name,
        value,
      })),
    ],
    cookies: Object.entries(oaRequest.cookies).map(([name, value]) => ({
      name,
      value,
    })),
    headersSize: -1,
    bodySize: -1,
  }

  if (oaRequest.body !== undefined) {
    if (typeof oaRequest.body === 'string') {
      harRequest.postData = {
        mimeType: oaRequest.contentType || 'application/json',
        text: oaRequest.body,
      }
    } else if (oaRequest.body instanceof FormData) {
      const formDataObject: Record<string, any> = {}

      oaRequest.body.forEach((value, key) => {
        if (value instanceof File) {
          formDataObject[key] = {
            type: 'file',
            text: 'BINARY',
            name: value.name,
            size: value.size,
            mimeType: value.type || 'application/octet-stream',
          }
        } else {
          const values = oaRequest.body.getAll(key)
          if (values.length > 1) {
            formDataObject[key] = values
          } else {
            formDataObject[key] = values[0]
          }
        }
      })

      harRequest.postData = {
        mimeType: oaRequest.contentType || 'multipart/form-data',
        text: JSON.stringify(formDataObject),
      }
    } else if (typeof oaRequest.body === 'object') {
      harRequest.postData = {
        mimeType: oaRequest.contentType || 'application/json',
        text: JSON.stringify(oaRequest.body),
      }
    }
  }

  return harRequest
}
