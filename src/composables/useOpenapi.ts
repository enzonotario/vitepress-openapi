let innerSpec: any = {}

const httpVerbs = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

export function useOpenapi({ spec } = { spec: null }) {
  if (spec) {
    setSpec(spec)
  }

  function setSpec(value: any) {
    innerSpec = value
  }

  function getOperation(operationId: string) {
    if (!innerSpec.paths) {
      return null
    }

    for (const path of Object.values(innerSpec.paths)) {
      for (const verb of httpVerbs) {
        if (path[verb]?.operationId === operationId) {
          return path[verb];
        }
      }
    }

    return null;
  }

  function getOperationPath(operationId: string) {
    if (!innerSpec.paths) return null;

    for (const [path, methods] of Object.entries(innerSpec.paths)) {
      for (const verb of httpVerbs) {
        if (methods[verb]?.operationId === operationId) {
          return path;
        }
      }
    }

    return null;
  }
  function getOperationParameters(operationId: string) {
    const operation = getOperation(operationId)
    return operation.parameters || []
  }

  function getBaseUrl() {
    if (!innerSpec.servers)
      return ''

    return innerSpec.servers[0].url
  }

  function getSchemas() {
    if (!innerSpec.components)
      return {}

    return innerSpec.components.schemas
  }

  function propertiesTypesJson(schema: any, responseType: string) {
    if (!schema?.properties) {
      return JSON.stringify(
        schema,
        null,
        2,
      )
    }

    return JSON.stringify(
      propertiesTypesJsonRecursive(schema, responseType),
      null,
      2,
    )
  }

  function propertiesTypesJsonRecursive(schema: any, responseType: string) {
    const body = {}

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      if (!property) {
        return
      }

      const { type } = property

      body[key] = type === 'object' ? propertiesTypesJsonRecursive(property, type) : type
    })

    return responseType === 'array' ? [body] : body
  }

  function propertiesAsJson(schema: any, responseType: string) {
    const body = {}

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      const { type } = property

      switch (type) {
        case 'string':
          body[key] = 'string'
          break
        case 'number':
        case 'integer':
          body[key] = 0
          break
        case 'boolean':
          body[key] = true
          break
        case 'array':
          body[key] = []
          break
        case 'object':
          body[key] = {}
          break
        default:
          body[key] = null
      }
    })

    return JSON.stringify(
      responseType === 'array' ? [body] : body,
      null,
      2,
    )
  }

  function getTags(): string[] {
    if (!innerSpec?.paths)
      return []

    return Object.values(innerSpec.paths).reduce((tags, path) => {
      if (!path.get)
        return tags

      const { tags: pathTags } = path.get

      if (!pathTags)
        return tags

      pathTags.forEach((pathTag) => {
        if (!tags.includes(pathTag))
          tags.push(pathTag)
      })

      return tags
    }, [])
  }

  function getOperationCodeSamples(operationId: string) {
    const operation = getOperation(operationId)
    return operation['x-codeSamples'] || operation['x-code-samples'] || []
  }

  function getSecuritySchemes() {
    return innerSpec.components.securitySchemes
  }

  return {
    spec: innerSpec,
    setSpec,
    getOperation,
    getOperationPath,
    getOperationParameters,
    getBaseUrl,
    getSchemas,
    propertiesTypesJson,
    propertiesTypesJsonRecursive,
    propertiesAsJson,
    getTags,
    getOperationCodeSamples,
  }
}
