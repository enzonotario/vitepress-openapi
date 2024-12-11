export function getExamples(property: any): any {
  if (property?.examples && property?.examples?.length > 0) {
    return property.examples
  }

  if (property?.schema?.examples && property?.schema?.examples?.length > 0) {
    return property.schema.examples
  }

  if (property?.example !== undefined) {
    return property.example
  }

  if (property?.subexamples && property?.subexamples?.length > 0) {
    return property.subexamples
  }

  if (property?.schema?.example !== undefined) {
    return [property.schema.example]
  }

  if (property?.subexample !== undefined) {
    return [property.subexample]
  }

  return null
}
