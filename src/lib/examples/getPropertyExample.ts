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

  if (property?.examples && property?.examples?.length > 0) {
    return property.examples[0]
  }

  if (property?.schema?.example !== undefined) {
    return property.schema.example
  }

  if (property?.schema?.examples && property?.schema?.examples?.length > 0) {
    const firstExample = property.schema.examples[0]

    if (firstExample) {
      return firstExample
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
