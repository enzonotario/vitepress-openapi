import type { OpenAPIV3, OpenAPIV3_1 } from '@scalar/openapi-types'
import type { OpenAPIDocument } from '../../types'

export const DEFAULT_AUTH_TOKEN_RESPONSE_FIELDS = ['access_token', 'token', 'accessToken'] as const

export const AUTH_OPERATION_PATTERN = /token|auth|login|oauth/i

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const

export interface AuthPlaygroundOptions {
  enabled?: boolean
  operationIds?: string[]
  scheme?: string
  tokenResponseFields?: string[]
}

export function getAuthorizationStorageKey(prefix: string, schemeName: string): string {
  return `${prefix}-authorization-${schemeName}`
}

export function extractAuthToken(
  body: unknown,
  fields: string[] = [...DEFAULT_AUTH_TOKEN_RESPONSE_FIELDS],
): string | null {
  if (body == null) {
    return null
  }

  if (typeof body === 'string') {
    const trimmed = body.trim()
    if (!trimmed) {
      return null
    }

    try {
      return extractAuthToken(JSON.parse(trimmed), fields)
    } catch {
      return trimmed
    }
  }

  if (typeof body !== 'object' || Array.isArray(body)) {
    return null
  }

  const record = body as Record<string, unknown>

  for (const field of fields) {
    const value = record[field]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }
  }

  return null
}

function hasEmptySecurity(security: OpenAPIV3.SecurityRequirementObject[] | undefined): boolean {
  if (security == null) {
    return true
  }

  return Array.isArray(security) && security.length === 0
}

function collectOperations(spec: OpenAPIDocument): Array<{ operationId: string, path: string, method: string, security?: OpenAPIV3.SecurityRequirementObject[] }> {
  const results: Array<{ operationId: string, path: string, method: string, security?: OpenAPIV3.SecurityRequirementObject[] }> = []
  const paths = spec.paths ?? {}

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== 'object') {
      continue
    }

    for (const method of HTTP_METHODS) {
      const operation = (pathItem as Record<string, unknown>)[method] as OpenAPIV3.OperationObject | undefined
      if (!operation || typeof operation !== 'object') {
        continue
      }

      const operationId = operation.operationId
      if (!operationId) {
        continue
      }

      results.push({
        operationId,
        path,
        method,
        security: operation.security as OpenAPIV3.SecurityRequirementObject[] | undefined,
      })
    }
  }

  return results
}

export function findAuthOperations(
  spec: OpenAPIDocument | null | undefined,
  options: AuthPlaygroundOptions = {},
): string[] {
  if (!spec) {
    return []
  }

  const operations = collectOperations(spec)

  if (options.operationIds?.length) {
    const available = new Set(operations.map(op => op.operationId))
    return options.operationIds.filter(id => available.has(id))
  }

  return operations
    .filter((op) => {
      if (op.method !== 'post') {
        return false
      }
      if (!hasEmptySecurity(op.security)) {
        return false
      }
      return AUTH_OPERATION_PATTERN.test(op.operationId) || AUTH_OPERATION_PATTERN.test(op.path)
    })
    .map(op => op.operationId)
}

export function hasHttpOrOauth2Schemes(spec: OpenAPIDocument | null | undefined): boolean {
  const schemes = (spec?.components?.securitySchemes ?? {}) as Record<string, OpenAPIV3.SecuritySchemeObject | OpenAPIV3_1.SecuritySchemeObject>

  return Object.values(schemes).some((scheme) => {
    if (!scheme || typeof scheme !== 'object' || !('type' in scheme)) {
      return false
    }
    if (scheme.type === 'oauth2') {
      return true
    }
    return scheme.type === 'http' && (scheme.scheme === 'bearer' || scheme.scheme === 'basic')
  })
}

export function resolveAuthPlaygroundScheme(
  spec: OpenAPIDocument | null | undefined,
  options: AuthPlaygroundOptions = {},
  defaultScheme?: string | null,
): string | null {
  if (options.scheme) {
    return options.scheme
  }

  if (defaultScheme) {
    return defaultScheme
  }

  const schemes = (spec?.components?.securitySchemes ?? {}) as Record<string, OpenAPIV3.SecuritySchemeObject>

  for (const [name, scheme] of Object.entries(schemes)) {
    if (scheme?.type === 'http' && scheme.scheme === 'bearer') {
      return name
    }
  }

  for (const [name, scheme] of Object.entries(schemes)) {
    if (scheme?.type === 'http') {
      return name
    }
  }

  for (const [name, scheme] of Object.entries(schemes)) {
    if (scheme?.type === 'oauth2') {
      return name
    }
  }

  const first = Object.keys(schemes)[0]
  return first ?? null
}

export function isAuthPlaygroundEnabled(
  spec: OpenAPIDocument | null | undefined,
  options: AuthPlaygroundOptions = {},
): boolean {
  if (options.enabled === false) {
    return false
  }

  const operationIds = findAuthOperations(spec, options)
  if (!operationIds.length) {
    return false
  }

  if (options.enabled === true) {
    return true
  }

  // Auto: enabled when operationIds are configured or http/oauth2 schemes exist.
  if (options.operationIds?.length) {
    return true
  }

  return hasHttpOrOauth2Schemes(spec)
}

export function isAuthValueEmpty(value: unknown, defaultValue?: string | null): boolean {
  if (value == null) {
    return true
  }

  const text = String(value).trim()
  if (!text) {
    return true
  }

  if (defaultValue != null && text === String(defaultValue)) {
    return true
  }

  return false
}
