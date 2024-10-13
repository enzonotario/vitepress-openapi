export function getExample(property) {
  if (property?.example) {
    return property.example
  }

  if (property?.examples) {
    return property.examples[Math.floor(Math.random() * property.examples.length)]
  }

  if (property?.schema?.example) {
    return property.schema.example
  }

  if (property?.schema?.examples) {
    return property.schema.examples[Math.floor(Math.random() * property.schema.examples.length)]
  }

  return null
}
