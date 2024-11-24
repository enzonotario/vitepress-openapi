const VALIDATION_KEYWORDS: ReadonlyArray<string> = [
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
  'maximum',
  'maxItems',
  'maxLength',
  'maxProperties',
  'minimum',
  'minItems',
  'minLength',
  'minProperties',
  'multipleOf',
  'pattern',
  'uniqueItems',
]

export function hasConstraints(property: Record<string, unknown>): boolean {
  return Object.keys(property).some(key => VALIDATION_KEYWORDS.includes(key))
}

export function getConstraints(property: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(property).reduce<Record<string, unknown>>((constraints, key) => {
    if (VALIDATION_KEYWORDS.includes(key)) {
      constraints[key] = property[key]
    }
    return constraints
  }, {})
}
