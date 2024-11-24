export function getExamples(property: any) {
  if (property.example) {
    return [property.example]
  }

  if (property.examples) {
    return property.examples
  }

  return undefined
}
