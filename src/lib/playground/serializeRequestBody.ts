import { isFormUrlEncoded } from '../utils/contentTypeUtils'

/**
 * Serializes a playground request body for `fetch`.
 * Objects stay as JSON by default; form-urlencoded becomes `a=b&c=d`.
 */
export function serializeRequestBody(
  body: unknown,
  contentType?: string | null,
): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined
  }

  if (
    body instanceof FormData
    || body instanceof Blob
    || body instanceof URLSearchParams
    || typeof body === 'string'
  ) {
    return body
  }

  if (contentType && isFormUrlEncoded(contentType) && typeof body === 'object') {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
      if (value === undefined || value === null) {
        continue
      }

      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)))
      } else {
        params.append(key, String(value))
      }
    }

    return params.toString()
  }

  return JSON.stringify(body)
}
