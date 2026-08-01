import type { HarRequest } from '@scalar/snippetz'
import type { OARequest } from './request'
import { isFormUrlEncoded, isMultipartFormData } from '../utils/contentTypeUtils'

const RE_TITLE_CASE = /\b\w/g

interface NamedValue {
  name: string
  value: string
}

/**
 * Fold structured request cookies into the Cookie header.
 * Collects every case-insensitive Cookie header, keeps one canonical slot,
 * and drops duplicate case-variant entries. Existing Cookie header names win
 * on duplicates; structured cookies fill gaps.
 * Mutates `headers` in place.
 */
function mergeCookiesIntoHeader(
  headers: NamedValue[],
  cookies: NamedValue[],
): void {
  const cookieHeaderIndexes: number[] = []
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === 'cookie') {
      cookieHeaderIndexes.push(i)
    }
  }

  if (cookieHeaderIndexes.length === 0 && cookies.length === 0) {
    return
  }

  const merged = new Map<string, string>()

  for (const index of cookieHeaderIndexes) {
    for (const part of headers[index].value.split(';')) {
      const trimmed = part.trim()
      if (!trimmed) {
        continue
      }
      const eq = trimmed.indexOf('=')
      const name = eq === -1 ? trimmed : trimmed.slice(0, eq).trim()
      const value = eq === -1 ? '' : trimmed.slice(eq + 1).trim()
      if (!merged.has(name)) {
        merged.set(name, value)
      }
    }
  }

  for (const cookie of cookies) {
    if (!merged.has(cookie.name)) {
      merged.set(cookie.name, cookie.value)
    }
  }

  const cookieHeaderValue = Array.from(merged.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')

  // Remove duplicate Cookie headers from the end so the first index stays valid.
  for (let i = cookieHeaderIndexes.length - 1; i >= 1; i--) {
    headers.splice(cookieHeaderIndexes[i], 1)
  }

  if (cookieHeaderIndexes.length > 0) {
    headers[cookieHeaderIndexes[0]] = { name: 'Cookie', value: cookieHeaderValue }
  } else if (merged.size > 0) {
    headers.push({ name: 'Cookie', value: cookieHeaderValue })
  }
}

export function buildHarRequest(
  oaRequest: OARequest,
): HarRequest {
  const headers = Object.entries(oaRequest.headers).map(([name, value]) => ({
    name: name.replace(RE_TITLE_CASE, letter => letter.toUpperCase()), // Convert to title case.
    value,
  }))

  const cookies = Object.entries(oaRequest.cookies).map(([name, value]) => ({
    name,
    value,
  }))

  // @scalar/snippetz js/fetch clients render HAR `cookies` as `Set-Cookie` (a
  // response header). Request cookies belong on the `Cookie` header, so fold
  // them there and clear `cookies` to avoid incorrect samples.
  mergeCookiesIntoHeader(headers, cookies)

  const harRequest: HarRequest = {
    method: oaRequest.method.toUpperCase(),
    url: decodeURI(oaRequest.url.toString()),
    httpVersion: 'HTTP/1.1',
    headers,
    queryString: [
      ...Object.entries(oaRequest.query).flatMap(([name, value]) => {
        if (Array.isArray(value)) {
          // Exploded arrays: create multiple entries with same name
          return value.map(v => ({ name, value: String(v) }))
        }
        return [{ name, value: typeof value === 'object' ? JSON.stringify(value) : String(value) }]
      }),
    ],
    cookies: [],
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
        params: Object.entries(formDataObject).map(([name, value]) => {
          if (typeof value === 'object' && value !== null && 'text' in value) {
            return {
              name,
              value: value.text,
              fileName: value.name,
              contentType: value.mimeType,
            }
          } else {
            return {
              name,
              value: String(value),
            }
          }
        }),
      }
    } else if (typeof oaRequest.body === 'object') {
      if (oaRequest.contentType && (isFormUrlEncoded(oaRequest.contentType) || isMultipartFormData(oaRequest.contentType))) {
        harRequest.postData = {
          mimeType: oaRequest.contentType,
          params: Object.entries(oaRequest.body).map(([name, value]) => {
            return {
              name,
              value: String(value),
            }
          }),
        }
      } else {
        // Default to JSON for other content types.
        harRequest.postData = {
          mimeType: oaRequest.contentType || 'application/json',
          text: JSON.stringify(oaRequest.body),
        }
      }
    }
  }

  return harRequest
}
