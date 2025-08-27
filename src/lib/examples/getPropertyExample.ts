function firstFromExamples(
  examples: any,
  unwrapArrayValue: boolean,
): { matched: boolean, value: any } {
  // Array form.
  if (Array.isArray(examples)) {
    if (examples.length === 0) {
      return {
        matched: false,
        value: undefined,
      }
    }

    const first = examples[0]
    if (unwrapArrayValue && first && typeof first === 'object' && 'value' in first) {
      return {
        matched: true,
        value: first.value,
      }
    }

    if (unwrapArrayValue) {
      return {
        matched: first !== undefined && first !== null,
        value: first,
      }
    }

    return {
      matched: true,
      value: first,
    }
  }

  // Named map form (object).
  if (examples && typeof examples === 'object') {
    const keys = Object.keys(examples)
    if (keys.length === 0) {
      return {
        matched: false,
        value: undefined,
      }
    }

    const firstKey = keys[0]
    const entry = (examples as any)[firstKey]
    if (entry && typeof entry === 'object' && 'value' in entry) {
      return {
        matched: true,
        value: entry.value,
      }
    }

    return {
      matched: entry !== undefined,
      value: entry,
    }
  }

  return {
    matched: false,
    value: undefined,
  }
}

export function getPropertyExample(property: any): any {
  if (property?.['x-playground-example'] !== undefined) {
    return property['x-playground-example']
  }

  if (property?.schema?.['x-playground-example'] !== undefined) {
    return property.schema['x-playground-example']
  }

  if (property?.example !== undefined) {
    return property.example
  }

  if (property?.examples !== undefined) {
    const firstExample = firstFromExamples(property.examples, false)
    if (firstExample.matched) {
      return firstExample.value
    }
  }

  if (property?.schema?.example !== undefined) {
    return property.schema.example
  }

  if (property?.schema?.examples !== undefined) {
    const firstExample = firstFromExamples(property.schema.examples, true)
    if (firstExample.matched) {
      return firstExample.value
    }
  }

  if (property?.subexample !== undefined) {
    return property.subexample
  }

  if (property?.subexamples && property?.subexamples?.length > 0) {
    return property.subexamples[0]
  }

  return null
}
