export function getExamples(property: any): any {
  if (property?.example !== undefined) {
    return [property.example]
  }

  if (property?.examples !== undefined) {
    return property.examples
  }

  return undefined
}
