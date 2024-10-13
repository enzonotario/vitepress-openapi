import xmlFormat from 'xml-formatter'

export function generateSchemaXml(schema: any, useExample = false): string {
  const xmlContent = propertiesTypesXmlRecursive(schema, useExample)
  return formatXml(`<root>${xmlContent}</root>`)
}

export function formatXml(xml: string): string {
  return xmlFormat(xml, {
    collapseContent: true,
  }).replace(/(\r\n|\n|\r)[ \t]*(\r\n|\n|\r)/g, '$1') // Remove empty lines.
}

function propertiesTypesXmlRecursive(schema: any, useExample = false): string {
  if (schema?.items) {
    return `<item>${getPropertyValueXml(schema.items, useExample)}</item>`
  }

  if (!schema?.properties) {
    return getPropertyValueXml(schema, useExample)
  }

  const propertiesKeys = Object.keys(schema.properties)
  let xmlString = ''

  propertiesKeys.forEach((key) => {
    const property = schema.properties[key]
    xmlString += `<${key}>${getPropertyValueXml(property, useExample)}</${key}>`
  })

  return xmlString
}

function getPropertyValueXml(property: any, useExample: boolean): string {
  const { type, example, examples } = property

  if (useExample && examples) {
    return examples[Math.floor(Math.random() * examples.length)]
  }

  if (useExample && example) {
    return example
  }

  switch (type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return '0'
    case 'boolean':
      return 'true'
    case 'array':
      if (property.items) {
        return `<item>${getPropertyValueXml(property.items, useExample)}</item>`
      }
      return ''
    case 'object':
    default:
      if (property.properties) {
        return propertiesTypesXmlRecursive(property, useExample)
      }
      return ''
  }
}
