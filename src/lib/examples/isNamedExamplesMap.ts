/**
 * Detects whether an object is a map of OpenAPI ExampleObjects
 * https://spec.openapis.org/oas/v3.1.0#example-object
 * We consider it a named-examples map if it's a non-array object and at least one entry
 * is an object containing one of the explicit ExampleObject keys.
 */

const EXAMPLE_EXPLICIT_KEYS = new Set(['value', 'externalValue', '$ref'])

export function isNamedExamplesMap(values: unknown): values is Record<string, unknown> {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return false
  }

  const record = values as Record<string, unknown>
  const keys = Object.keys(record)
  if (keys.length === 0) {
    return false
  }

  for (const k of keys) {
    const v = (record as Record<string, unknown>)[k]
    if (
      v
      && typeof v === 'object'
      && !Array.isArray(v)
      && Object.keys(v as object).some(key => EXAMPLE_EXPLICIT_KEYS.has(key))
    ) {
      return true
    }
  }

  return false
}
