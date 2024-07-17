let spec: any = {}

export function useOpenapi() {
  function setSpec(value: any) {
    spec = value
  }

  function getOperation(operationId: string) {
    if (!spec.paths)
      return null

    return Object.values(spec.paths).find(path => path.get.operationId === operationId).get
  }

  function getOperationPath(operationId: string) {
    if (!spec.paths)
      return null

    return Object.keys(spec.paths).find(path => spec.paths[path].get.operationId === operationId)
  }

  function getOperationParameters(operationId: string) {
    const operation = getOperation(operationId)
    return operation.parameters || []
  }

  function getBaseUrl() {
    if (!spec.servers)
      return ''

    return spec.servers[0].url
  }

  function getSchemas() {
    if (!spec.components)
      return {}

    return spec.components.schemas
  }

  function propertiesTypesJson(schema: any, responseType: string) {
    if (!schema?.properties) {
      return JSON.stringify(
        schema,
        null,
        2,
      )
    }

    const body = {}

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      const { type } = property

      body[key] = type
    })

    return JSON.stringify(
      responseType === 'array' ? [body] : body,
      null,
      2,
    )
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
    if (!spec?.paths)
      return []

    return Object.values(spec.paths).reduce((tags, path) => {
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
    return spec.components.securitySchemes
  }

  return {
    spec,
    setSpec,
    getOperation,
    getOperationPath,
    getOperationParameters,
    getBaseUrl,
    getSchemas,
    propertiesTypesJson,
    propertiesAsJson,
    getTags,
    getOperationCodeSamples,
  }
}
