export function getPropertyExamples(property: any): any {
  if (property?.examples !== undefined) {
    return property.examples
  }

  if (property?.schema?.examples !== undefined) {
    return property.schema.examples
  }

  if (property?.example !== undefined) {
    return [property.example]
  }

  if (property?.subexamples !== undefined) {
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
