export function getExample(property: any) {
  if (property?.example) {
    return property.example
  }

  if (property?.examples && property.examples.length > 0) {
    return property.examples[0]
  }

  if (property?.schema?.example) {
    return property.schema.example
  }

  if (property?.schema?.examples && property.schema.examples.length > 0) {
    return property.schema.examples[0]
  }

  if (property?.subexample) {
    return property.subexample
  }

  if (property?.subexamples && property.subexamples.length > 0) {
    return property.subexamples[0]
  }

  return null
}
