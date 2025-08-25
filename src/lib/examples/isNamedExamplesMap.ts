/**
 * Detects whether an object is a map of OpenAPI ExampleObjects
 * https://spec.openapis.org/oas/v3.1.0#example-object
 * We consider it a named-examples map if it's a non-array object and at least one entry
 * is an object containing one of the known ExampleObject keys.
 */
export function isNamedExamplesMap(values: unknown): values is Record<string, any> {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return false
  }
  const keys = Object.keys(values as Record<string, unknown>)
  if (keys.length === 0) {
    return false
  }
  const EXAMPLE_KEYS = new Set(['value', 'summary', 'description', 'externalValue', '$ref'])
  return keys.some((k) => {
    const v = (values as any)[k]
    return v && typeof v === 'object' && Object.keys(v as object).some(key => EXAMPLE_KEYS.has(key))
  })
}
