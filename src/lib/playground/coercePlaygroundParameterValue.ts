export interface ParameterSchemaLike {
  type?: string | readonly string[]
  items?: unknown
  prefixItems?: unknown
  properties?: unknown
}

type JsonKind = 'array' | 'object'

function jsonKinds(schema: unknown): Set<JsonKind> {
  if (!schema || typeof schema !== 'object') {
    return new Set()
  }

  // A bare $ref has no local kind. OpenAPI 3.1 Schema Objects can also
  // carry keywords next to $ref, and those keywords still apply.
  // https://spec.openapis.org/oas/v3.1.2.html#schema-object

  const candidate = schema as ParameterSchemaLike
  const rawType = candidate.type
  const types = Array.isArray(rawType)
    ? rawType
    : typeof rawType === 'string'
      ? [rawType]
      : []

  const kinds = new Set<JsonKind>()

  if (types.includes('array') || (types.length === 0 && (candidate.items !== undefined || candidate.prefixItems !== undefined))) {
    kinds.add('array')
  }

  if (types.includes('object') || (types.length === 0 && candidate.properties !== undefined)) {
    kinds.add('object')
  }

  return kinds
}

export function schemaAcceptsStructuredJson(schema: unknown): boolean {
  return jsonKinds(schema).size > 0
}

/**
 * The playground text field shows arrays and objects as JSON.
 * An edit stores that text. Parse it back when the schema expects
 * an array or object, so OpenAPI `style` and `explode` can run.
 * Incomplete JSON stays as text while the user types.
 */
export function coercePlaygroundParameterValue(schema: unknown, value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const kinds = jsonKinds(schema)
  if (kinds.size === 0) {
    return value
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return value
  }

  const looksLikeArray = trimmed.startsWith('[')
  const looksLikeObject = trimmed.startsWith('{')
  if (looksLikeArray && !kinds.has('array')) {
    return value
  }
  if (looksLikeObject && !kinds.has('object')) {
    return value
  }
  if (!looksLikeArray && !looksLikeObject) {
    return value
  }

  try {
    const parsed = JSON.parse(trimmed)
    if (kinds.has('array') && Array.isArray(parsed)) {
      return parsed
    }
    if (kinds.has('object') && parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed
    }
  }
  catch {
    return value
  }

  return value
}

/**
 * Value stored from the playground text field.
 * Only an array is parsed. Object JSON stays a string so query serialization
 * does not switch to form-object keys.
 */
export function valueFromPlaygroundTextField(schema: unknown, value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const coerced = coercePlaygroundParameterValue(schema, value)
  return Array.isArray(coerced) ? coerced : value
}
