export function getExample(property: any) {
  if (property?.example !== undefined) {
    return property.example
  }

  if (property?.examples?.length > 0) {
    return property.examples[0]
  }

  if (property?.schema?.example !== undefined) {
    return property.schema.example
  }

  if (property?.schema?.examples?.length > 0) {
    return property.schema.examples[0]
  }

  if (property?.subexample !== undefined) {
    return property.subexample
  }

  if (property?.subexamples?.length > 0) {
    return property.subexamples[0]
  }

  return null
}
