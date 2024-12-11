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
  'default',
]

export function hasConstraints(property: Record<string, unknown>): boolean {
  return Object.keys(property).some(key => VALIDATION_KEYWORDS.includes(key))
}

export function getConstraints(property: Record<string, unknown>): Record<string, unknown> {
  return Object.entries(property)
    .filter(([key]) => VALIDATION_KEYWORDS.includes(key))
    .reduce((constraints: Record<string, unknown>, [key, value]) => {
      constraints[key] = value
      return constraints
    }, {})
}
