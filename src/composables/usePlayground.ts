import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OperationData } from '../lib/operationData'
import { inject, ref } from 'vue'
import { OPERATION_DATA_KEY } from '../lib/operationData'

export interface SecuritySchemeDefaultValues {
  'http-basic': string
  'http-bearer': string
  'apiKey': string | null
  'openIdConnect': string
  'oauth2': string
}

export interface PlaygroundResponse {
  body: any
  type: string
  time: string | null
  status: number | null
  headers?: Record<string, string>
}

export interface SubmitOptions {
  request: any
  method: string
  baseUrl: string
  path: string
  operationId: string
}

let securitySchemeDefaultValues: SecuritySchemeDefaultValues = {
  'http-basic': 'Basic Auth',
  'http-bearer': 'Token',
  'apiKey': null,
  'openIdConnect': 'OpenID Connect',
  'oauth2': 'OAuth2 Token',
}

export function usePlayground() {
  const loading = ref(false)
  const response = ref<PlaygroundResponse | null>(null)
  const imageUrls = ref<string[]>([])
  const operationData = inject<OperationData | undefined>(OPERATION_DATA_KEY)

  function setSecuritySchemeDefaultValues(values: Partial<SecuritySchemeDefaultValues>) {
    securitySchemeDefaultValues = {
      ...securitySchemeDefaultValues,
      ...values,
    }
  }

  function getSecuritySchemeDefaultValue(scheme: OpenAPIV3.SecuritySchemeObject) {
    if (scheme.type === 'http') {
      const schemeKey = scheme.scheme === 'basic' ? 'http-basic' : 'http-bearer'
      return securitySchemeDefaultValues[schemeKey]
    }

    const schemeType = scheme.type as keyof SecuritySchemeDefaultValues
    if (Object.keys(securitySchemeDefaultValues).includes(schemeType) && securitySchemeDefaultValues[schemeType] !== null) {
      return securitySchemeDefaultValues[schemeType] ?? ''
    }

    if (scheme.type === 'apiKey' && scheme.name) {
      return scheme.name
    }

    return ''
  }

  async function submitRequest({ request, method, baseUrl, path, operationId }: SubmitOptions) {
    if (!request) {
      return null
    }

    response.value = null
    const defaultRequestUrl = `${baseUrl}${path}`

    const innerResponse: PlaygroundResponse = {
      body: null,
      type: '',
      time: null,
      status: null,
    }

    trackEvent(operationId)

    const start = performance.now()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    try {
      innerResponse.time = null
      innerResponse.body = '{}'
      loading.value = true

      const url = new URL(request.url ?? defaultRequestUrl)
      for (const [key, value] of Object.entries(request.query)) {
        if (Array.isArray(value)) {
          // For exploded arrays, append each value separately
          value.forEach(v => url.searchParams.append(key, String(v)))
        } else {
          url.searchParams.set(key, String(value))
        }
      }

      const data = await fetch(url.toString(), {
        method: method.toUpperCase(),
        headers: request.body instanceof FormData ? {} : (request.headers ?? {}),
        body: request.body instanceof FormData
          ? request.body
          : ((typeof request.body === 'string' || request.body instanceof Blob) ? request.body : JSON.stringify(request.body)),
        signal: controller.signal,
      })

      const contentType = data.headers.get('Content-Type') || 'text/plain'
      const contentDisposition = data.headers.get('Content-Disposition') || ''
      innerResponse.type = contentType
      // Expose headers for downstream components (e.g., filename extraction).
      try {
        innerResponse.headers = Object.fromEntries(data.headers.entries())
      } catch {
        const hdrs: Record<string, string> = {}
        if (contentType) {
          hdrs['content-type'] = contentType
        }
        if (contentDisposition) {
          hdrs['content-disposition'] = contentDisposition
        }
        innerResponse.headers = hdrs
      }

      if (/json/i.test(contentType)) {
        innerResponse.body = await data.json()
      } else if (/xml/i.test(contentType) || /html/i.test(contentType) || /text\/plain/.test(contentType)) {
        innerResponse.body = await data.text()
      } else if (/^image\//i.test(contentType)) {
        const blob = await data.blob()
        innerResponse.body = URL.createObjectURL(blob)
        // Store the blob URL to release it later.
        imageUrls.value.push(innerResponse.body)
      } else if (/^audio\//i.test(contentType)) {
        innerResponse.body = await data.blob()
      } else if (/^application\/octet-stream/i.test(contentType) || /attachment|download/i.test(contentDisposition)) {
        innerResponse.body = await data.blob()
      } else {
        innerResponse.body = await data.text()
      }

      innerResponse.status = data.status
    } catch (error: any) {
      innerResponse.body = error?.message
      innerResponse.type = 'text/plain'
      innerResponse.status = 500
    } finally {
      clearTimeout(timeoutId)
      loading.value = false
      const end = performance.now()
      innerResponse.time = (end - start).toFixed(2)

      response.value = innerResponse
    }

    return innerResponse
  }

  function trackEvent(operationId: string) {
    try {
      // @ts-expect-error: gtag is defined in the global scope
      window.gtag('event', 'try_it', {
        event_category: 'api',
        event_label: operationId,
      })
    } catch { }
  }

  function cleanupImageUrls() {
    // Release the blob URLs to prevent memory leaks.
    imageUrls.value.forEach(URL.revokeObjectURL)
    imageUrls.value = []
  }

  function setParameterValue(parameterName: string, value: any) {
    if (!operationData || !parameterName) {
      return
    }

    const parsedValue = typeof value === 'object' && value !== null
      ? JSON.parse(JSON.stringify(value))
      : value

    operationData.playground.parameterValues.value[parameterName] = parsedValue
  }

  return {
    loading,
    response,
    imageUrls,
    setSecuritySchemeDefaultValues,
    getSecuritySchemeDefaultValue,
    submitRequest,
    cleanupImageUrls,
    setParameterValue,
    hasOperationData: !!operationData,
  }
}
